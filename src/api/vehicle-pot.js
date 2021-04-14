import { chGet, chPost, chPut, chDelete } from './index'
export function vehiclePotList(page = 1, limit = 10) {
  return chGet('jyvehicle/pot/page', {
    page, limit
  })
}

export function addVehiclePot(form) {
  return chPost('jyvehicle/pot', form)
}

export function editVehiclePot(form) {
  return chPut('jyvehicle/pot', form)
}

export function deleteVehiclePot(id) {
  return chDelete(`jyvehicle/pot/${id}`)
}

