/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import Redis from '@ioc:Adonis/Addons/Redis'
import Order from 'App/Models/Order'

Redis.subscribe('order:out', (order: string) => {
  setTimeout(async () => {
    const { orderid } = JSON.parse(order)

    try {
      if (orderid) {
        await (await Order.findByOrFail('orderid', orderid)).merge({ status: 40 }).save()
        console.log('订单：', orderid, ' 发货了')
      }
    } catch (error) {}
  }, 20000)
})
