/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ request, logger }) => {
  logger.info({ ip: request.ip() }, 'someone visit /')
  return 'Hello World'
})

Route.group(() => {
  // 用户相关
  Route.post('register', 'UsersController.register')
  Route.post('login', 'UsersController.login')

  // 商品相关
  Route.group(() => {
    Route.get('', 'ProductsController.index').prefix('product')

    // 用户端
    Route.group(() => {
      Route.post('/buy/:proid', 'ProductsController.buy')
    })
      .prefix('product')
      .middleware(['auth'])

    // 管理端
    Route.group(() => {
      Route.group(() => {
        Route.post('', 'ProductsController.store')
        Route.put('/:proid', 'ProductsController.update')
        Route.delete('/:proid', 'ProductsController.destroy')
      })
    }).prefix('admin/product')
  })

  // 订单相关
  Route.group(() => {
    // 用户端
    Route.get('', 'OrdersController.index').prefix('order').middleware(['auth'])

    // 管理端
    Route.get('', 'OrdersController.index').prefix('admin/order')
  })
}).prefix('api')
