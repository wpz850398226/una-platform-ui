import { chGet, chPost, chPut, chDelete } from './index'
export function vehicleDeviceList(page = 1, limit = 10) {
  return chGet('jyvehicle/device/page', {
    page, limit
  })
}

export function addVehicleDevice(form) {
  return chPost('jyvehicle/device', form)
}

export function editVehicleDevice(form) {
  return chPut('jyvehicle/device', form)
}

export function deleteVehicleDevice(id) {
  return chDelete(`jyvehicle/device/${id}`)
}

