
import axios from 'axios'
import { MessageBox } from 'element-ui'
import CMessage from '@/utils/el-message'
import store from '@/store'
import { getToken, getTentId, getAppKey } from '@/utils/auth'

// import { getCompanyId } from '@/utils/food'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    // do something before request is sent
    // console.log('检查token', store.getters.token)
    if (store.getters.token) {
      // console.log('有token')
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // console.warn(getToken())
      config.headers['Authorization'] = getToken()
      // config.headers['companyId'] = getCompanyId()
    }
    if (store.getters.tentId) {
      // console.log('有token')
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // console.warn(getToken())
      config.headers['tentId'] = getTentId()
      config.headers['appKey'] = getAppKey()
    }
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
    // console.log(response)

    const res = response.data
    // console.log('请求结果', response.data)
    if (!res.status) { return res }
    // if the custom code is not 20000, it is judged as an error.
    if (res.status !== 200 || (Object.prototype.hasOwnProperty.call(res, 'rel') && !res.rel)) {
      console.log('请求状态异常')
      CMessage.error(res.message || '服务器错误')

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.status === 40301) {
        // to re-login
        MessageBox.confirm('您已注销，您可以取消停留在该页上，或重新登录', '您已注销', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            // alert('aaaa')
            location.reload()
          })
        })
      }
      return Promise.reject({
        error: res.message || 'Error',
        data: res.data
      })
    } else {
      // console.log('请求状态正常')
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    CMessage.error(error.message)
    return Promise.reject(error)
  }
)

export default service
