import { deleteData, getData, postData, putData } from './http'

export const getProducts = async params => {
  return await getData('/product', params)
}

export const createProducts = async params => {
  return await postData('/admin/product', params)
}

export const modifyProducts = async params => {
  return await putData(`/admin/product/${params.proid}`, params)
}

export const deleteProducts = async proid => {
  return await deleteData(`/admin/product/${proid}`)
}
