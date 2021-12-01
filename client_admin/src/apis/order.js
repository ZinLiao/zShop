import { getData } from './http'

export const getAllOrders = async params => {
  return await getData('/admin/order', params)
}
