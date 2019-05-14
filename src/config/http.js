import axios from 'axios'
import { Toast } from 'mint-ui'
import router from '../router'

// axios 配置
axios.defaults.timeout = 30000

/* eslint-disable*/
// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
  }
)

export const fetchGet = (url, data, requestHasArray,ids) => {
  if (requestHasArray) {
    return axios.get(url,{
      'params': data,
      'paramsSerializer': params =>{
        return qs.stringify(params, {arrayFormat: 'repeat'})
      }})
  }
  return axios.get(url+'/'+ids, {params: data})
}

export const fetchPost = (url, data, type) => {
  if (type === 'json') {
    return axios.post(url, data)
  }
  return  axios.post(url, qs.stringify(data))
}

export const fetchDelete = (url, data) => {
  return axios.delete(url, data)
}
export const fetchPut = (url, data) => {
  return axios.put(url, qs.stringify(data))
}

export const fetchCancelGet = (url, data, cancel) => {
  return axios.get(url, {params: data, cancelToken: cancel})
}