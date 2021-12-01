import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RegisterValidator from 'App/Validators/RegisterValidator'
import LoginValidator from 'App/Validators/LoginValidator'

export default class UsersController {
  public async register({ auth, request, response, logger }: HttpContextContract) {
    let params = request.only(['email', 'password'])

    params = await request.validate(RegisterValidator)

    try {
      const user = await User.findBy('email', params.email)

      if (user) {
        logger.warn(`用户${params.email}已存在`)
        return response.send({ code: 100000, msg: '用户已存在' })
      } else {
        const user = new User()

        user.email = params.email
        user.password = await Hash.make(params.password)

        await user.save()

        const token = await auth.use('api').attempt(params.email, params.password, {
          expiresIn: '7days'
        })

        logger.info(`创建用户${user}成功`)
        return { code: 0, data: token }
      }
    } catch (error) {
      logger.error(error, '注册异常')
      return { code: 999999, msg: '系统异常，请联系管理员' }
    }
  }

  public async login({ auth, request, logger }: HttpContextContract) {
    let params = request.only(['email', 'password'])

    params = await request.validate(LoginValidator)

    try {
      const user = await User.findBy('email', params.email)

      if (!user) {
        logger.warn({ email: params.email }, '该邮箱未注册')
        return { code: 100000, msg: '该邮箱未注册，请先进行注册' }
      }

      if (!(await Hash.verify(user.password, params.password))) {
        logger.warn({ user }, '登录密码错误')
        return { code: 100001, msg: '登录密码错误' }
      }

      const token = await auth.use('api').attempt(params.email, params.password, {
        expiresIn: '7days',
      })

      logger.info(`用户${user.email}登录成功`)
      return { code: 0, data: token }
    } catch (error) {
      logger.error(error, '登录异常')
      return { code: 999999, msg: '系统异常，请联系管理员' }
    }
  }
}
