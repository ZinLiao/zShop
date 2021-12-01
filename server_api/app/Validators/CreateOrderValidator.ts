import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateOrderValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    proid: schema.number([
      rules.required()
    ]),
    recipient: schema.string({
      escape: true,
      trim: true,
    }, [
      rules.required()
    ]),
    phone: schema.string({}, [
      rules.required(),
      rules.regex(/^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/)
    ]),
    address: schema.string({
      escape: true,
      trim: true
    }, [
      rules.required()
    ]),
    quantity: schema.number([
      rules.required()
    ]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = {
    'recipient.required': '请填写收件人姓名',
    'phone.required': '请填写收件人手机号',
    'phone.regex': '手机号格式不正确',
    'address.required': '请填写收件人地址',
    'quantity.required': '购买数量至少为1'
  }
}
