import { chGet, chPost, chPut, chDelete } from './index'
export function dutyCarList(page = 1, limit = 10) {
  return chGet('jyvehicle/duty/page', {
    page, limit
  })
}

export function dutyCarListAll() {
  return chGet('jyvehicle/duty/all')
}

export function addDutyCar(form) {
  return chPost('jyvehicle/duty', form)
}

export function editDutyCar(form) {
  return chPut('jyvehicle/duty', form)
}

export function deleteDutyCar(id) {
  return chDelete(`jyvehicle/duty/${id}`)
}

export function updateDutyCarLimit() {
  return chPost(`jyvehicle/duty/checkLimit`, {
    check: 1
  })
}
