import { chGet, chPost, chPut, chDelete } from './index'

export function busUserList(page = 1, limit = 10, searchKey) {
  return chPost('jybase/busUser/users', {
    page, limit, ...searchKey
  })
}

export function busUserListAll() {
  return chGet('jybase/busUser/all')
}

export function busCompanyUserListAll(id) {
  return chGet(`jybase/busUser/getUserListByCompanyId/${id}`)
}

export function addBusUser(form) {
  return chPost('jybase/busUser/add', form)
}

export function editBusUser(form) {
  return chPut('jybase/busUser/update', form)
}

export function deleteBusUser(id) {
  return chDelete(`jybase/busUser/${id}`)
}

export function setUserFaceImg(id, faceImg) {
  return chPost('jybase/busUser/addFaceIdentification', { id, faceImg })
}

