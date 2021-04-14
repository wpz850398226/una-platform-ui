import { chPost, chPut, chDelete } from './index'

export function busNetDeviceList(page = 1, limit = 10) {
  return chPost('jybase/busNetDevice/devices', {
    page, limit
  })
}

export function addBusNetDevice(form) {
  return chPost('jybase/busNetDevice/add', form)
}

export function editBusNetDevice(form) {
  return chPut('jybase/busNetDevice/update', form)
}

export function deleteBusNetDevice(id) {
  return chDelete(`jybase/busNetDevice/${id}`)
}

