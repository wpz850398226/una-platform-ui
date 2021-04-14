import { chGet, chPost, chPut, chDelete } from './index'

export function conditionsList(page = 1, limit = 10, defId = '') {
  return chGet('jyact/conditions/page', {
    page, limit, defId
  })
}

export function conditionsListByDefId(defId) {
  return chGet(`jyact/conditions/getConditionsByDefId/${defId}`)
}

export function addConditions(form) {
  return chPost('jyact/conditions', form)
}

export function editConditions(form) {
  return chPut('jyact/conditions', form)
}

export function deleteConditions(id) {
  return chDelete(`jyact/conditions/${id}`)
}

