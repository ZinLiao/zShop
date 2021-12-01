import Database from '@ioc:Adonis/Lucid/Database'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'
import User from 'App/Models/User'
import Order from 'App/Models/Order'
import { DateTime } from 'luxon'
import Redis from '@ioc:Adonis/Addons/Redis'
import CreateOrderValidator from 'App/Validators/CreateOrderValidator'
import CreateProductValidator from 'App/Validators/CreateProductValidator'
import PageQueryValidator from 'App/Validators/PageQueryValidator'

export default class ProductsController {
  public async index({ request, logger }: HttpContextContract) {
    const isAdmin = request.headers().role
    let params = request.only(['per_page', 'current_page', 'query'])

    params = await request.validate(PageQueryValidator)

    try {
      const data = await Database.from('products')
        .where('status', isAdmin ? '<=' : '=', isAdmin ? 2 : 1)
        .if(params.query, (query) => {
          query.where('name', 'like', `%${params.query}%`)
          query.where('detail', 'like', `%${params.query}%`)
        })
        .orderBy('created_time', 'desc')
        .paginate(params.current_page, params.per_page)

      logger.info((isAdmin ? '管理员' : '用户') + request.ip() + '正在查询商品')

      return data
    } catch (error) {
      logger.error(error, '商品查询异常')
      return { code: 999999, msg: '系统异常，请联系管理员' }
    }
  }

  public async store({ request, response, logger }: HttpContextContract) {
    const isAdmin = request.headers().role
    let params = request.only(['name', 'detail', 'price', 'stock', 'status'])

    params = await request.validate(CreateProductValidator)

    try {
      if (isAdmin) {
        await Product.create(params)

        logger.info(`管理员${request.ip()}添加商品成功`, params)
        return { code: 0, msg: '商品添加成功' }
      } else {
        logger.warn(`非法操作-添加商品`, `IP：${request.ip()}`)
        response.status(401).send('禁止操作')
      }
    } catch (error) {
      logger.error(error, '添加商品异常')
      return { code: 999999, msg: '系统异常，请联系管理员' }
    }
  }

  public async update({ request, response, logger }: HttpContextContract) {
    const isAdmin = request.headers().role
    const { proid } = request.params()
    let params = request.only(['name', 'detail', 'price', 'stock', 'status'])

    params = await request.validate(CreateProductValidator)

    // 开启事务
    const trx = await Database.transaction()
    
    try {
      if (isAdmin) {
        await (await Product.findOrFail(proid)).merge(params).save()
        await trx.commit()
        logger.info(params, `管理员${request.ip()}商品${proid}更新成功`)
        return { code: 0, msg: '更新成功' }
      } else {
        await trx.commit()
        logger.warn(`非法操作-修改商品，IP：${request.ip()}`)
        response.status(401).send('禁止操作')
      }
    } catch (error) {
      await trx.rollback()
      logger.error(error, '修改商品异常')
      return { code: 999999, msg: '系统异常，请联系管理员' }
    }
  }

  public async destroy({ request, response, logger }: HttpContextContract) {
    const { proid } = request.params()
    const isAdmin = request.headers().role

    // 开启事务
    const trx = await Database.transaction()

    try {
      if (isAdmin) {
        await (await Product.findOrFail(proid)).merge({ status: 3 }).save()
        await trx.commit()
        logger.info(`管理员${request.ip()}商品${proid}删除成功`)
        return { code: 0, msg: '商品删除成功' }
      } else {
        await trx.commit()
        logger.warn(`非法操作-删除商品，IP：${request.ip()}`)
        response.status(401).send('禁止操作')
      }
    } catch (error) {
      await trx.rollback()
      logger.error(error, '删除商品异常')
      return { code: 999999, msg: '系统异常，请联系管理员' }
    }
  }

  public async buy({ auth, request, response, logger }: HttpContextContract) {
    const userId = await auth.use('api').token?.userId
    const user = await User.findBy('userid', userId)
    let params = request.only([
      'proid',
      'recipient',
      'phone',
      'address',
      'quantity'
    ])
    
    params = await request.validate(CreateOrderValidator)

    // 开启事务
    const trx = await Database.transaction()
    
    try {
      if (userId && user) {
        const product = await Product.findOrFail(params.proid)

        // 判断当前状态：1-在售 2-下架 3-删除
        if (product.status > 1) {
          await trx.rollback()
          logger.warn(`商品${params.proid}状态已变，仍可下单，请运营排查库存是否正常，请开发排查系统是否异常`)
          return {code: 100003, msg: '商品已下架，无法购买'}
        }

        // 判断库存
        // 当前库存为0
        if (!product.stock) {
          await trx.rollback()
          logger.warn(
            `商品${params.proid}已卖完，仍可下单，请运营排查库存是否正常，请开发排查系统是否异常`
          )
          return { code: 100001, msg: '商品已卖完，无法下单' }
        }

        // 库存小于下单数量
        const lessStock = product.stock - params.quantity
        if (lessStock < 0) {
          await trx.rollback()
          logger.warn(
            `商品${params.proid}库存不足，当前库存：${product.stock}，下单数量：${params.quantity}`
          )
          return { code: 100002, msg: '库存数量不足，请重新下单' }
        }

        // 构造订单
        const order = new Order()
        const targetPro = await Product.findByOrFail('proid', params.proid)

        order.userid = userId
        order.proid = params.proid
        order.status = 20
        order.recipient = params.recipient
        order.phone = params.phone
        order.address = params.address
        order.quantity = params.quantity
        order.payment = (params.quantity * (targetPro.price * 1000)) / 1000
        order.paymenttype = 1
        order.paymentTime = DateTime.local()

        // 保存订单
        order.save()
        logger.info(order, `用户${userId}订单生成`)

        // 更新库存
        await product.merge({ stock: lessStock }).save()
        logger.info(`商品${params.proid}库存更新，剩余库存：${lessStock}`)

        // 关闭事务操作
        await trx.commit()

        // 通知仓库发货
        Redis.publish('order:out', JSON.stringify(order))
        logger.info(`通知库存发货, 订单号:${order.orderid}`)

        return { code: 0, msg: '购买成功！' }
      } else {
        await trx.commit()
        logger.error(`系统异常，${request.ip()}未登录或邮箱不存在也触发了购买动作，请开发排查问题`)
        response.status(401).send({ code: 100000, msg: '请先登录再购买' })
      }
    } catch (error) {
      await trx.rollback()
      logger.error(error, '下单异常')
      return { code: 999999, msg: '系统异常，请联系管理员' }
    }
  }
}
