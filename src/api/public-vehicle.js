import { chGet, chPost, chPut, chDelete } from './index'
export function publicList(page = 1, limit = 10) {
  return chGet('jyvehicle/public/page', {
    page, limit
  })
}

export function publicListAll() {
  return chGet('jyvehicle/public/all')
}

export function addPublic(form) {
  return chPost('jyvehicle/public', form)
}

export function editPublic(form) {
  return chPut('jyvehicle/public', form)
}

export function deletePublic(id) {
  return chDelete(`jyvehicle/public/${id}`)
}

export function updatePublicCarLimit() {
  return chPost(`jyvehicle/public/checkLimit`, {
    check: 1
  })
}

