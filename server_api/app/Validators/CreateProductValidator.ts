import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateProductValidator {
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
    name: schema.string({
      trim: true,
      escape: true
    }, [
      rules.required()
    ]),
    detail: schema.string({
      trim: true,
      escape: true
    }, [
      rules.required()
    ]),
    price: schema.number([
      rules.required()
    ]),
    stock: schema.number([
      rules.required(),
      rules.range(1, 999999),
    ]),
    status: schema.enum(
      [1, 2] as const,
      [
        rules.required()
      ]
    )
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
    'name.required': '必须填写商品名称',

    'detail.required': '必须填写商品描述',

    'price.required': '必须填写商品单价，单位：元',

    'stock.required': '必须填写商品数量，单位：件',
    'stock.range': '商品数量最少1件，最多999999件',

    'status.required': '必须选择商品当前状态，在售或者下架',
    'status.enum': '商品状态必须为在售或下架状态'
  }
}
