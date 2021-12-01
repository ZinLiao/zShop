import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Order extends BaseModel {
  // 订单ID
  @column({ isPrimary: true })
  public orderid: number

  // 用户ID
  @column()
  public userid: string | number

  // 商品ID
  @column()
  public proid: number

  // 订单状态：0-已取消-10-未付款，20-已付款，40-已发货，50-交易成功，60-交易关闭
  @column()
  public status: number

  // 收货人姓名
  @column()
  public recipient: string

  // 收货电话
  @column()
  public phone: string

  // 收货地址
  @column()
  public address: string

  // 购买数量
  @column()
  public quantity: number

  // 实付金额
  @column()
  public payment: number

  // 支付类型：1-在线支付
  @column()
  public paymenttype: number

  // 支付时间
  @column.dateTime({
    serialize: (value) => value.toFormat('yyyy-LL-dd HH:mm:ss'),
  })
  public paymentTime: DateTime

  // 发货时间
  @column.dateTime({
    serialize: (value) => value && value.toFormat('yyyy-LL-dd HH:mm:ss'),
  })
  public sendTime: DateTime

  // 交易完成时间
  @column.dateTime({
    serialize: (value) => value && value.toFormat('yyyy-LL-dd HH:mm:ss'),
  })
  public endTime: DateTime

  // 交易关闭时间
  @column.dateTime({
    serialize: (value) => value && value.toFormat('yyyy-LL-dd HH:mm:ss'),
  })
  public closedTime: DateTime

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
