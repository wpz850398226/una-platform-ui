/*
 * @Author: Cui
 * @Date: 2020-09-23 10:21:09
 * @LastEditTime: 2020-09-23 10:38:52
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /ch-uiap-ui/src/api/application.js
 */
import { chGet, chPost, chPut } from './index'

// 应用管理
export function applicationList(page = 1, limit = 10) {
  return chGet('admin/application/page', {
    page, limit
  })
}

export function applicationListAll() {
  return chGet('admin/application/all')
}

export function addApplication(form) {
  return chPost('admin/application', form)
}

export function editApplication(form) {
  return chPut('admin/application', form)
}

export function grantAppToTenant(tenantId, appIds) {
  return chPost('admin/application/addAppTenant', {
    tenantId,
    appIds
  })
}

export function grantedAppList(id) {
  return chGet(`admin/tenant/getAuthApp/${id}`)
}

export function authedAppList() {
  return chGet('admin/application/getAuthAppByTentId')
}

export function getAppAuthTenantList(appId) { // 该应用授权的租户
  return chGet(`admin/tenant/getAuthTenant/${appId}`)
}

