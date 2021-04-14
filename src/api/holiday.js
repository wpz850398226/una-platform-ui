import { chGet, chPost, chPut, chDelete } from './index'

export function holidayList(page = 1, limit = 9999) {
  return chGet('jybase/duty/holiday/page', {
    page, limit
  })
}

export function addHoliday(form) {
  return chPost('jybase/duty/holiday', form)
}

export function editHoliday(form) {
  return chPut('jybase/duty/holiday', form)
}

export function deleteHoliday(id) {
  return chDelete(`jybase/duty/holiday/${id}`)
}

