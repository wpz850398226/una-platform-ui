// 网络请求
import axios from '@/utils/request'

const reqUrl = '/api/jydiningroom'

const reqUrl2 = '/api/jybase'

async function chGet(url, data) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${reqUrl}${url}`,
      method: 'GET',
      params: data
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        console.error('与服务器通信异常')
        reject(err)
      })
  })
}

async function chGet2(url, data) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${reqUrl2}${url}`,
      method: 'GET',
      params: data
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        console.error('与服务器通信异常')
        reject(err)
      })
  })
}

async function chPostdata(url, data) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${reqUrl}${url}`,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      data: data
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}
async function chPostparams(url, data) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${reqUrl}${url}`,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      params: data
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

async function chPut(url, data) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${reqUrl}${url}`,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      params: data
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

async function chDelete(url, data) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${reqUrl}${url}`,
      method: 'DELETE',
      params: data
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export { chPostdata, chPostparams, chGet, chGet2, chDelete, chPut }
