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
  return chPost('login/login', data)
}

export function accessKey() {
  return request({
    url: '/api/auth/jwt/userKey',
    method: 'get'
  })
}

export function getInfo() {
  return chGet('account/getInfo')
}

export function getElements() {
  return chGet('permission/getByToken')
}

export function getUserMenu(token) {
  return request({
    url: '/sys/menu/getByToken',
    method: 'get'
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

// 账号是否可用
export function countByUsername(username) {
  return request({
    url: `/api/auth/jwt/countByUsername/${username}`,
    method: 'get'
  })
}

// 获取手机号是否占用
export function getUserByTelPhone(phone) {
  return request({
    url: `/api/auth/jwt/getUserByTelPhone/${phone}`,
    method: 'get'
  })
}

// 发送验证码
export function addSendMsg(phone) {
  return request({
    url: `/api/auth/jwt/forgetPwd/addSendMsg/${phone}`,
    method: 'get'

  })
}

// 注册
export function registerUser(data) {
  return request({
    url: '/api/auth/jwt/registerUser',
    method: 'post',
    data
  })
}

// 忘记密码
export function updatePwd(data) {
  return request({
    url: '/api/auth/jwt/forgetPwd/updatePwd',
    method: 'post',
    data
  })
}

// 短信验证码登陆
export function phoneLogin(data) {
  return request({
    url: '/api/auth/jwt/validateByCode',
    method: 'post',
    data
  })
}

// 人员管理

export function userList(page = 1, limit = 10, name = '', telPhone = '', isDelete = 0) {
  console.log(name, telPhone)
  return chGet('admin/account/page', {
    page, limit, name, telPhone, isDelete
  })
}

export function userListAll() {
  return chGet('admin/account/all')
}

export function addUser(form) {
  return chPost('admin/account', form)
}

export function editUser(form) {
  return chPut('admin/account', form)
}

export function deleteUser(id) {
  return chDelete(`admin/account/${id}`)
}

export function userPwdReset(username) {
  return chPost('admin/account/resetPwd', { username })
}

export function changePwd(form) {
  return chPut('admin/account/changePwd', form)
}
