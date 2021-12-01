import { getData, postData } from './http'

export const getProducts = async params => {
  return await getData('/product', params)
}

export const buyProduct = async params => {
  return await postData(`/product/buy/${params.proid}`, params)
}
