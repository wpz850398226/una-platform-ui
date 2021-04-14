import { chGet, chPost, chPut, chDelete } from './index'

export function busNoticeList(page = 1, limit = 10) {
  return chGet('jybase/busNotice/page', {
    page, limit
  })
}

export function addBusNotice(form) {
  return chPost('jybase/busNotice', form)
}

export function editBusNotice(form) {
  return chPut('jybase/busNotice', form)
}

export function deleteBusNotice(id) {
  return chDelete(`jybase/busNotice/${id}`)
}

