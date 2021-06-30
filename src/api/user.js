/*
 * @Author: Cui
 * @Date: 2020-06-23 21:15:05
 * @LastEditTime: 2020-09-23 15:49:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ch-uiap-ui/src/api/user.js
 */
import request from '@/utils/request'
import { chGet, chPost, chPut, chDelete } from './index'

export function login(data) {
  return chPost('/sys/login/login', data)
}

export function accessKey() {
  return request({
    url: '/api/auth/jwt/userKey',
    method: 'get'
  })
}

export function getInfo() {
  return chGet('/sys/account/getInfo')
}

export function getElements() {
  return chGet('/sys/permission/getByToken')
}

export function getUserMenu() {
  return chGet('/sys/menu/getByToken')
}

export function changePwd(query) {
  return chPost(`/sys/account/save`, query)
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

