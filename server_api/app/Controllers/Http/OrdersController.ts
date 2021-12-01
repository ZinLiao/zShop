import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import PageQueryValidator from 'App/Validators/PageQueryValidator'

export default class OrdersController {
  public async index({ auth, request, response, logger }: HttpContextContract) {
    const userId = await auth.use('api').token?.userId
    const isAdmin = request.headers().role
    let params = request.only(['per_page', 'current_page', 'query'])
    let data

    params = await request.validate(PageQueryValidator)

    try {
      // 用户端订单
      if (userId) {
        data = await Database.from('orders')
          .join('products', 'orders.proid', '=', 'products.proid')
          .select('orders.*')
          .select('products.name as proName')
          .where('userid', userId)
          .orderBy('created_time', 'desc')
          .paginate(params.current_page, params.per_page)

        logger.info(`用户${userId}查询订单中`)
        return data
      }

      // 管理端所有订单
      if (isAdmin) {
        data = await Database.from('orders')
          .join('products', 'orders.proid', '=', 'products.proid')
          .join('users', 'orders.userid', '=', 'users.userid')
          .select('orders.*')
          .select('products.name as proName')
          .select('users.email')
          .if(params.query, (query) => {
            query.where('orderid', 'like', `%${params.query}%`)
          })
          .orderBy('created_time', 'desc')
          .paginate(params.current_page, params.per_page)

        logger.info(`管理员${request.ip()}查询订单中`)
        return data
      }

      logger.error(`非法用户正在查询订单，IP：${request.ip()}`)
      response.status(401).send('非法操作')
    } catch (error) {
      logger.error(error, '订单查询异常')
      return { code: 999999, msg: '系统异常，请联系管理员' }
    }
  }
}
