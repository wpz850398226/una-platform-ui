import { chGet, chPost, chPut, chDelete } from './index'

export function equipmentList(page = 1, limit = 10) {
  return chGet('jylayout/equipment/page', {
    page, limit
  })
}

export function addEquipment(form) {
  return chPost('jylayout/equipment', form)
}

export function editEquipment(form) {
  return chPut('jylayout/equipment', form)
}

export function deleteEquipment(id) {
  return chDelete(`jylayout/equipment/${id}`)
}

