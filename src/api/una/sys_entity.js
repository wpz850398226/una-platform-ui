import { chGet, chPost, chPut, chDelete } from '../index'
export function entityList(page = 1, limit = 10) {
  return chGet('entity/page', {
    page, limit
  })
}

export function entityListAll() {
  return chGet('entity/list')
}

export function addEntity(form) {
  return chPost('entity/save', form)
}

export function editEntity(form) {
  return chPut('entity', form)
}

export function deleteEntity(id) {
  return chDelete(`entity/${id}`)
}
