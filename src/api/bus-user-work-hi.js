import { chGet, chPost, chPut, chDelete } from './index'

export function busUserWorkHiList(userId, page = 1, limit = 10) {
  return chGet('jybase/busUserWorkHi/page', {
    page, limit, userId
  })
}

export function addBusUserWorkHi(form) {
  return chPost('jybase/busUserWorkHi', form)
}

export function editBusUserWorkHi(form) {
  return chPut('jybase/busUserWorkHi', form)
}

export function deleteBusUserWorkHi(id) {
  return chDelete(`jybase/busUserWorkHi/${id}`)
}

