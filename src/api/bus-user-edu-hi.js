import { chGet, chPost, chPut, chDelete } from './index'

export function busUserEduHiList(userId, page = 1, limit = 10) {
  return chGet('jybase/busUserEduHi/page', {
    page, limit, userId
  })
}

export function addBusUserEduHi(form) {
  return chPost('jybase/busUserEduHi', form)
}

export function editBusUserEduHi(form) {
  return chPut('jybase/busUserEduHi', form)
}

export function deleteBusUserEduHi(id) {
  return chDelete(`jybase/busUserEduHi/${id}`)
}

