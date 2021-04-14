import { chGet, chPost, chPut, chDelete } from './index'

export function postUserList(companyId = '', statPattern = 'userId', userId = '', postId = '') {
  return chGet('jybase/duty/postUser/page', {
    statPattern, companyId, userId, postId
  })
}

export function addPostUser(form) {
  return chPost('jybase/duty/postUser', form)
}

export function editPostUser(form) {
  return chPut('jybase/duty/postUser', form)
}

export function deletePostUser(id) {
  return chDelete(`jybase/duty/postUser/${id}`)
}

