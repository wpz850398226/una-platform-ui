
import axios from 'axios'
import CMessage from '@/utils/el-message'
import store from '@/store'
import { getToken, getTentId, getAppKey } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL: 'http://192.168.1.3:80', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    // do something before request is sent
    //
    if (store.getters.token) {
      //
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      //
      config.headers['Authorization'] = getToken()
      // config.headers['companyId'] = getCompanyId()
    }
    if (store.getters.tentId) {
      //
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      //
      config.headers['tentId'] = getTentId()
      config.headers['appKey'] = getAppKey()
    }
    return config
  },
  error => {
    // do something with request error

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
    //

    const res = response.data
    if (res.code && (res.code === 500 || res.code === 400)) {
      CMessage.error(res.message)
      return Promise.reject({
        error: res.message || 'Error',
        data: res.data
      })
    }
    return res
    // console.log(res, 'kkkk')
    // //
    // if (!res.status) { return res }
    // // if the custom code is not 20000, it is judged as an error.
    // if (res.status !== 200) {
    //   CMessage.error(res.message || '服务器错误')

    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.status === 40301) {
    //     // to re-login
    //     MessageBox.confirm('您已注销，您可以取消停留在该页上，或重新登录', '您已注销', {
    //       confirmButtonText: '重新登录',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         // alert('aaaa')
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject({
    //     error: res.message || 'Error',
    //     data: res.data
    //   })
    // } else {
    //   //
    //   return res
    // }
  },
  error => {
    CMessage.error(error.message)
    return Promise.reject(error)
  }
)

export default service
