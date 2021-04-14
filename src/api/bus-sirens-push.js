import { chGet, chPost, chPut, chDelete } from './index'

export function busSirensPushList(page = 1, limit = 10) {
  return chGet('jybase/busSirensPush/page', {
    page, limit
  })
}

export function addBusSirensPush(form) {
  return chPost('jybase/busSirensPush', form)
}

export function editBusSirensPush(form) {
  return chPut('jybase/busSirensPush', form)
}

export function deleteBusSirensPush(id) {
  return chDelete(`jybase/busSirensPush/${id}`)
}

