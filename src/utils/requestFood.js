/*
 * @Author: your name
 * @Date: 2020-06-23 21:15:05
 * @LastEditTime: 2020-09-21 11:29:26
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /ch-uiap-ui/src/utils/request.js
 */
import axios from 'axios'
import { Message } from 'element-ui'
// import store from "@/store";
import { getCompanyId } from '@/utils/food'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // console.log('检查token', store.getters.token)

    config.headers['companyId'] = getCompanyId()
    config.headers['Content-Type'] = 'application/json'

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if (response.status !== 200) {
      Message({
        message: response.message || '服务器错误',
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      return response
    }
    // if the custom code is not 20000, it is judged as an error.
    // if (res.status !== 200) {
    //   console.log("请求状态异常");
    //   Message({
    //     message: res.message || "服务器错误",
    //     type: "error",
    //     duration: 5 * 1000
    //   });

    //   return Promise.reject(new Error(res.message || "Error"));
    // } else {
    //   console.log("请求状态正常");
    //   return res;
    // }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
