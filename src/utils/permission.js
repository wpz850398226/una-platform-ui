/*
 * @Author: Cui
 * @Date: 2020-09-23 08:54:30
 * @LastEditTime: 2020-09-23 15:37:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ch-uiap-ui/src/utils/permission.js
 */
import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value) {
    // const roles = store.getters && store.getters.roles
    const elements = store.getters && store.getters.elements
    const permissionElement = value

    // const hasPermission = roles.some(role => {
    //   return permissionRoles.includes(role)
    // })
    const hasPermission = elements.reduce((t, v) => v === permissionElement ? [...t, v] : t, [])
    return hasPermission.length > 0
  } else {
    // console.error(`need roles! Like v-permission="['admin','editor']"`)
    // return false
    return true
  }
}
