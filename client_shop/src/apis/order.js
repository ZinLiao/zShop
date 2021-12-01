import { getData } from './http'

export const getMyOrders = async params => {
  return await getData('/order', params)
}
