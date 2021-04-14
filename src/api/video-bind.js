import { chGet, chPost, chPut, chDelete } from './index'

export function videoUnBindList() {
  return chGet('jybase/busComCam/allCam')
}

export function videoBindList(rootCompanyId, page = 1, limit = 10) {
  return chGet('jybase/busComCam/page', {
    rootCompanyId, page, limit
  })
}

export function addVideoBind(form) {
  return chPost('jybase/busComCam', form)
}

export function editVideoBind(form) {
  return chPut('jybase/busComCam', form)
}

export function deleteVideoBind(id) {
  return chDelete(`jybase/busComCam/${id}`)
}

export function videoUrl(deviceId, channelId) {
  return chGet('jybase/busComCam/videoUrl', {
    deviceId, channelId
  })
}

