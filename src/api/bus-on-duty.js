import { chGet, chPost, chPut, chDelete } from './index'

export function busOnDutyList(page = 1, limit = 10, onDutyTime) {
  return chPost('jybase/busOnDuty/duties', {
    page, limit, onDutyTime
  })
}

export function busOnDutyListAll() {
  return chGet('jybase/busOnDuty/all')
}

export function addBusOnDuty(form) {
  return chPost('jybase/busOnDuty/add', form)
}

export function editBusOnDuty(form) {
  return chPut('jybase/busOnDuty/update', form)
}

export function deleteBusOnDuty(id) {
  return chDelete(`jybase/busOnDuty/${id}`)
}

