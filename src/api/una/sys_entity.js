import { chGet, chPost, chPut, chDelete } from '../index'
export function entityList(pageNum = 1, pageSize = 10, query) {
  return chGet('/sys/entity/page', {
    pageNum, pageSize, ...query
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
