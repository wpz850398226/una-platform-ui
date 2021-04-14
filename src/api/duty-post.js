import { chGet, chPost, chPut, chDelete } from './index'

export function postList(page = 1, limit = 10) {
  return chGet('jybase/duty/post/page', {
    page, limit
  })
}

export function postListAll(page = 1, limit = 999) {
  return chGet('jybase/duty/post/page', {
    page, limit
  })
}

export function addPost(form) {
  return chPost('jybase/duty/post', form)
}

export function editPost(form) {
  return chPut('jybase/duty/post', form)
}

export function deletePost(id) {
  return chDelete(`jybase/duty/post/${id}`)
}

