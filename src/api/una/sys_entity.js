import { chGet, chPost, chPut, chDelete, jsonPut } from '../index'
export function entityList(pageNum = 1, pageSize = 10, query) {
  return chGet('/sys/entity/page', {
    pageNum, pageSize, ...query
  })
}

export function entityById(id) {
  return chGet(`/sys/entity/${id}`)
}

export function entityListAll() {
  return chGet('/sys/entity/list')
}

export function addEntity(form) {
  return chPost('/sys/entity/save', form)
}

export function editEntity(form) {
  return chPut('/sys/entity', form)
}

export function deleteEntity(id) {
  return chDelete(`/sys/entity/${id}`)
}

export function importTemplateDownload(className) {
  return chGet(`/sys/importTemplate/${className}`)
}

export function rolePermission(query) {
  return chGet(`/sys/rolePermission/list`, query)
}

export function grantPermission(query) {
  return jsonPut(`/sys/rolePermission/batch`, query)
}

export function permissionList(query) {
  return chGet(`/sys/permission/list`, query)
}
