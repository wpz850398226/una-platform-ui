import { chGet, chPost, chPut, chDelete } from './index'

export function appList(page = 1, limit = 10) {
  return chGet('jybase/appVersion/page', {
    page, limit
  })
}

export function addApp(form) {
  return chPost('api/jybase/appVersion/addAppVersion', form)
}

export function editApp(form) {
  return chPut('jybase/appVersion', form)
}

export function deleteApp(id) {
  return chDelete(`jybase/appVersion/${id}`)
}

