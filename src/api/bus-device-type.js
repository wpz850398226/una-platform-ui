import { chGet, chPost, chPut, chDelete } from './index'

export function busDeviceTypeList(page = 1, limit = 10, name = '') {
  return chGet('jybase/busDeviceType/page', {
    page, limit, name
  })
}

export function busDeviceTypeListAll(form) {
  return chGet('jybase/busDeviceType/list', form)
}

export function addBusDeviceType(form) {
  return chPost('jybase/busDeviceType/add', form)
}

export function editBusDeviceType(form) {
  return chPut('jybase/busDeviceType/update', form)
}

export function deleteBusDeviceType(id) {
  return chDelete(`jybase/busDeviceType/${id}`)
}

