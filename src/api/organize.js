/*
 * @Author: Cui
 * @Date: 2020-09-23 10:20:36
 * @LastEditTime: 2020-09-23 10:37:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ch-uiap-ui/src/api/organize.js
 */
import { chGet, chPost, chDelete, chPut } from './index'

// 组织管理

export function organizeUserList(orgId, name = '') { // 组织下人员列表
  return chGet('admin/account/getUserByOrgId', {
    orgId, name
  })
}

export function companiesList() {
  return chGet(`admin/organization/getOrgList`)
}

export function orgUserList(orgId) { // 组织下人员列表
  return chGet(`admin/organization/getOrgUser/${orgId}`)
}

export function companyUserList() { // 组织下人员列表
  return chGet('admin/account/getUserListByCompanyId')
}

export function organizeTree(appKey = 'uUdTluWpcZzkf4Yyog0FPuXXvoue0saO', tentId = '', type = '') { // 获取组织树
  return chGet('admin/organization/getOrgTree', {
    appKey, tentId, type
  })
}

export function addOrganize(form) { // 添加组织
  return chPost('admin/organization', form)
}

export function editOrganize(form) { // 修改组织
  return chPut('admin/organization', form)
}

export function deleteOrganize(id) { // 删除组织
  return chDelete(`admin/organization/${id}`)
}

export function grantedOrganizeUserList(id) { // 组织授权用户列表
  return chGet(`admin/userOrgMapper/getUserByOrgId/${id}`)
}

export function grantOrganize(orgId, userIds) { // 组织授权
  return chPost('admin/userOrgMapper', { userIds, orgId })
}

