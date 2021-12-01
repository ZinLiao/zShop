import Vue from 'vue'
import VueAxios from 'vue-axios'
import axios from 'axios'

Vue.use(VueAxios, axios)

async function request (params) {
  const res = await Vue.axios(params)
  let resData = null

  resData = res.data && typeof res.data === 'string' ? JSON.parse(res.data) : res.data
  return resData
}

function getData (url, data, headers = {}) {
  return request({
    method: 'get',
    url: '/api' + url,
    params: data,
    headers
  })
}

function postData (url, data, headers = {}) {
  return request({
    method: 'post',
    url: '/api' + url,
    data,
    headers
  })
}

function putData (url, data, headers = {}) {
  return request({
    method: 'put',
    url: '/api' + url,
    data,
    headers
  })
}

function deleteData (url, data, headers = {}) {
  return request({
    method: 'delete',
    url: '/api' + url,
    data,
    headers
  })
}

axios.interceptors.request.use((config) => {
  if ([
    '/api/login',
    '/api/register'
    // '/api/product'
  ].indexOf(config.url) === -1) {
    const token = window.localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = token
    }
  }

  return config
})

axios.interceptors.response.use(response => {
  return response
}, err => {
  const { errors } = err.response.data
  switch (err.response.status) {
    case 422:
      err.message = errors[0].message
      break

    case 500:
      err.message = '系统异常，请联系管理员'
      break

    default:
      break
  }

  return Promise.reject(err.message)
})

export { getData, postData, putData, deleteData }
