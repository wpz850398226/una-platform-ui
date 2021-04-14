
import { chGet, chPost, chPut, chDelete } from './index'

export function busLimitRuleList(page = 1, limit = 10, queryFields) {
  return chGet('jybase/busLimitRules/page', {
    page, limit, ...queryFields
  })
}

export function deleteTip(county) {
  return chGet('jybase/busLimitRules/deleteTip', {
    county
  })
}

export function addBusLimitRule(form) {
  return chPost('jybase/busLimitRules/add', form)
}

export function editBusLimitRule(form) {
  return chPut('jybase/busLimitRules/update', form)
}

export function deleteBusLimitRule(id) {
  return chDelete(`jybase/busLimitRules/${id}`)
}

