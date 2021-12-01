import { postData } from './http'

export const login = async params => {
  return await postData('/login', params)
}

export const register = async params => {
  return await postData('/register', params)
}
