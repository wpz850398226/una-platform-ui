import { chGet, chPost, chPut } from './index'

export function savePostPlan(form) {
  return chPost('jybase/duty/schedule/save', form)
}

export function queryPostPlan(startTime, endTime, companyId = '') {
  return chGet('jybase/duty/schedule/page', {
    startTime, endTime, companyId
  })
}

export function updatePostPlan(form) {
  return chPut('jybase/duty/schedule', form)
}

export function launchAlarm() {
  return chGet('jybase/busSirensPush/pushAll')
}
