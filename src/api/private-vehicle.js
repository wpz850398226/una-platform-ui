import { chGet, chPost, chPut, chDelete } from './index'
export function privateVehicleList(page = 1, limit = 10) {
  return chGet('jyvehicle/private/page', {
    page, limit
  })
}

export function privateVehicleListAll() {
  return chGet('jyvehicle/private/all')
}

export function addPrivateVehicle(form) {
  return chPost('jyvehicle/private', form)
}

export function editPrivateVehicle(form) {
  return chPut('jyvehicle/private', form)
}

export function deletePrivateVehicle(id) {
  return chDelete(`jyvehicle/private/${id}`)
}

