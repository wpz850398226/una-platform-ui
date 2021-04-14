import { chGet, chPost, chPut, chDelete } from '../index'
export function entityList(page = 1, limit = 10) {
  return chGet('/sys/entity/page', {
    page, limit
  })
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
