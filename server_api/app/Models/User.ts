import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  // 用户ID
  @column({ isPrimary: true })
  public userid: number

  // 用户邮箱
  @column()
  public email: string

  // 密码
  @column()
  public password: string

  // 创建时间
  @column.dateTime({
    autoCreate: true,
    serialize: (value) => value.toFormat('yyyy-LL-dd HH:mm:ss'),
  })
  public createdTime: DateTime

  // 更新时间
  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value) => value.toFormat('yyyy-LL-dd HH:mm:ss'),
  })
  public updatedTime: DateTime
}
