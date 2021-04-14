/*
 * @Author: Cui
 * @Date: 2020-09-23 10:20:28
 * @LastEditTime: 2020-09-23 10:41:02
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /ch-uiap-ui/src/api/menu.js
 */
import { chGet, chPost, chPut, chDelete } from './index'

// 菜单管理

export function elementTree(appKey) {
  return chGet('admin/menu/getEleTreeUser', { appKey })
}

export function menuTree(appKey) { // 菜单管理树
  return chGet('admin/menu/tree', { appKey })
}

export function addMenu(menu) { // 添加菜单
  return chPost('admin/menu', menu)
}

export function editMenu(menu) { // 编辑菜单
  return chPut('admin/menu', menu)
}

export function deleteMenu(id) { // 删除菜单
  return chDelete(`admin/menu/${id}`)
}

// ------------------------------------------------ //

// 菜单资源管理

export function elementList(menuId, name = '') { // 资源列表
  return chGet('admin/element/list', { menuId, name })
}

export function addElement(form) {
  return chPost('admin/element', form)
}

export function editElement(form) {
  return chPut('admin/element', form)
}

export function deleteElement(id) {
  return chDelete(`admin/element/${id}`)
}
