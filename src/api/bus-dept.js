import { chGet, chPost, chPut, chDelete } from './index'

export function busDeptList(page = 1, limit = 10) {
  return chGet('jybase/busDept/page', {
    page, limit
  })
}

export function busDeptListAll() {
  return chGet('jybase/busDept/all')
}

export function addBusDept(form) {
  return chPost('jybase/busDept', form)
}

export function editBusDept(form) {
  return chPut('jybase/busDept', form)
}

export function deleteBusDept(id) {
  return chDelete(`jybase/busDept/${id}`)
}

