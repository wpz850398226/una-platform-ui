
import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_msc_token'
const TentId = 'TentId_MSC'
const AppKey = 'AppKey_MSC'

export function getAppKey() {
  return Cookies.get(AppKey)
}

export function setAppKey(appKey) {
  return Cookies.set(AppKey, appKey)
}

export function removeAppKey() {
  console.log('删除AppKey')
  return Cookies.remove(AppKey)
}

export function getTentId() {
  return Cookies.get(TentId)
}

export function setTentId(tentId) {
  return Cookies.set(TentId, tentId)
}

export function removeTentId() {
  console.log('删除TentId')
  return Cookies.remove(TentId)
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  console.log('删除token')
  return Cookies.remove(TokenKey)
}
