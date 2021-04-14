import { chGet, chPost, chPut, chDelete } from './index'

export function busUserActionHiList(userId, page = 1, limit = 10) {
  return chGet('jybase/busUserActionHi/page', {
    page, limit, userId
  })
}

export function addBusUserActionHi(form) {
  return chPost('jybase/busUserActionHi', form)
}

export function editBusUserActionHi(form) {
  return chPut('jybase/busUserActionHi', form)
}

export function deleteBusUserActionHi(id) {
  return chDelete(`jybase/busUserActionHi/${id}`)
}

