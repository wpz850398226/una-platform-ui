/*
 * @Author: Cui
 * @Date: 2020-09-23 10:20:20
 * @LastEditTime: 2020-09-23 10:43:38
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /ch-uiap-ui/src/api/role.js
 */
import { chGet } from './index'

// 角色管理

export function roleTree(form) { // 角色树
  return chGet('admin/group/list', form)
}

export function roleType() { // 角色类型
  return chGet('admin/groupType/all')
}

export function roleList() { // 当前应用角色列表
  return chGet('admin/group/getGroupByAppTent')
}

