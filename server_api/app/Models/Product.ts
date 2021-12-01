import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Product extends BaseModel {
  // 商品ID
  @column({ isPrimary: true })
  public proid: number

  // 商品名称
  @column()
  public name: string

  // 商品描述
  @column()
  public detail: string

  // 价格
  @column()
  public price: number

  // 数量
  @column()
  public stock: number

  // 状态：1-在售，2-下架
  @column()
  public status: number

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
