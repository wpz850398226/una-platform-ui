import { chGet, chPost, chPut, chDelete } from './index'
export function publicApplyList(page = 1, limit = 10) {
  return chGet('jyvehicle/publicApply/page', {
    page, limit
  })
}

export function addPublicApply(form) {
  return chPost('jyvehicle/publicApply', form)
}

export function editPublicApply(form) {
  return chPut('jyvehicle/publicApply', form)
}

export function deletePublicApply(id) {
  return chDelete(`jyvehicle/publicApply/${id}`)
}

