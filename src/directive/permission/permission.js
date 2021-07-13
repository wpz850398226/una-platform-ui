/*
 * @Author: Cui
 * @Date: 2020-09-18 14:12:28
 * @LastEditTime: 2020-09-23 09:04:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ch-uiap-ui/src/directive/permission/permission.js
 */
import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  const elements = store.getters && store.getters.elements

  if (value) {
    const permissionElement = value

    // const hasPermission = elements.filter((item) => item.code === permissionElement)
    const hasPermission = elements.reduce((t, v) => v === permissionElement ? [...t, v] : t, [])

    //
    // const hasPermission = roles.some(role => {
    //   return permissionRoles.includes(role)
    // })

    if (hasPermission.length === 0) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  } else {
    throw new Error(`need roles! Like v-permission="['admin','editor']"`)
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  }
  // update(el, binding) {
  //   checkPermission(el, binding)
  // }
}
