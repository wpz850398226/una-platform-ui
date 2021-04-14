import { chGet, chPost, chPut, chDelete } from './index'
export function whiteListList(page = 1, limit = 10) {
  return chGet('jyvehicle/whiteList/page', {
    page, limit
  })
}

export function addWhiteList(form) {
  return chPost('jyvehicle/whiteList', form)
}

export function editWhiteList(form) {
  return chPut('jyvehicle/whiteList', form)
}

export function deleteWhiteList(id) {
  return chDelete(`jyvehicle/whiteList/${id}`)
}

