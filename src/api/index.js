// 网络请求
import axios from '@/utils/request'
import axiosA from 'axios'
import { getToken, getTentId, getAppKey } from '@/utils/auth'

import qs from 'query-string'

const reqUrl = process.env.VUE_APP_BASE_URL

const imgUrl = process.env.VUE_APP_IMG_URL

function chImg(url) {
  // console.log(url, 'Jie')
  if (url) {
    if (url.indexOf('data:image') !== -1) { // base64
      return {
        url,
        name: ''
      }
    }
    if (url.split('@').length === 2) { // ext
      return {
        url: `${imgUrl}${url.split('@')[0]}`,
        name: url.split('@')[1]
      }
    }
  }

  return { // undefined
    url: `${imgUrl}${url}`,
    name: ''
  }
}

function parseImg(url) {
  if (url.split('@').length === 2) {
    return {
      url: `${url.split('@')[0]}`,
      name: url.split('@')[1]
    }
  }
  return {
    url: '',
    name: ''
  }
}

function chUnImg(url) {
  if (url.split(imgUrl).length === 2) {
    return url.split(imgUrl)[1]
  }
  return ''
}

function removePropertyOfNull(obj) {
  const outObj = obj
  if (obj) {
    Object.keys(obj).forEach((item) => {
      if (!obj[item] && obj[item] !== 0) delete outObj[item]
    })
    return outObj
  }
  return ''
}

async function chGet(url, data) {
  // console.log('chGet', qs.stringify(data))
  const reqData = qs.stringify(removePropertyOfNull(data))
  const g = reqData ? '?' : ''
  const urlStr = `${url}${g}${reqData}`
  console.log(urlStr, 'chGet方法请求地址')
  return new Promise((resolve, reject) => {
    axios({
      url: urlStr,
      method: 'GET',
      data
    }).then((res) => {
      console.log('get请求' + urlStr + '正常，返回内容为：', res)
      resolve(res)
    }).catch((err) => {
      console.error('与服务器通信异常')
      reject(err)
    })
  })
}

async function chPost(url, data) {
  console.log('通用post调用，数据：', data)
  data = qs.stringify(removePropertyOfNull(data)) // 序列化
  // const reqData = JSON.stringify(data)
  console.log(`${reqUrl}${url}`)
  return new Promise((resolve, reject) => {
    axios({
      url: `${reqUrl}${url}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: data
    }).then((res) => {
      resolve(res)
    }).catch((err) => {
      reject(err)
    })
  })
}

async function chPut(url, data) {
  // const reqData = JSON.stringify(data)
  data = qs.stringify(removePropertyOfNull(data)) // 序列化
  console.log(`${reqUrl}${url}`)
  return new Promise((resolve, reject) => {
    axios({
      url: `${reqUrl}${url}`,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      data: data
    }).then((res) => {
      resolve(res.data)
    }).catch((err) => {
      reject(err)
    })
  })
}

async function chDelete(url) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${reqUrl}${url}`,
      method: 'DELETE'
    }).then((res) => {
      resolve(res.data)
    }).catch((err) => {
      reject(err)
    })
  })
}

async function chUpload(file) {
  const form = new FormData()
  form.append('file', file)

  return new Promise((resolve, reject) => {
    axiosA({
      url: `${reqUrl}jyteam/sysFile/upload`,
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': getToken(),
        'tentId': getTentId()
        // 'appKey': getAppKey()
      },
      data: form
    }).then((res) => {
      resolve(res.data)
    }).catch((err) => {
      reject(err)
    })
  })
}

function base642Blob(base64Data) {
  const arr = base64Data.split(',')
  const fileType = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let l = bstr.length
  const u8Arr = new Uint8Array(l)

  while (l--) {
    u8Arr[l] = bstr.charCodeAt(l)
  }
  return new Blob([u8Arr], {
    type: fileType
  })
}

function blob2File(newBlob, fileName = 'default') {
  newBlob.lastModifiedDate = new Date()
  newBlob.name = fileName
  return new window.File([newBlob], fileName, { type: newBlob.type })
}

async function chDownloadAS(downloadUrl, filename) {
  if (!downloadUrl) {
    return
  }
  console.log(downloadUrl, '下载地址')
  const blob = await chDownloadA(downloadUrl)
  const url = window.URL.createObjectURL(new Blob([blob]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

async function chDownloadA(url) {
  console.log('chDownload', url)
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `${url}`,
      responseType: 'blob',
      headers: {
        'Authorization': getToken(),
        'tentId': getTentId(),
        'appKey': getAppKey()
      }
    }).then((res) => {
      resolve(res.data)
    }).catch((err) => {
      reject(err)
    })
  })
}

export {
  chPost, chGet, chDelete, chPut, chUpload,
  chImg, chUnImg, parseImg, base642Blob, blob2File,
  chDownloadAS
}
