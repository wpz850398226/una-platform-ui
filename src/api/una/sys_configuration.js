import { chGet, chPost, chPut, chDelete } from '../index'
export function configurationList(page = 1, limit = 10) {
  return chGet('configuration/page', {
    page, limit
  })
}

export function configurationListAll() {
  return chGet('configuration/all')
}

export function addConfiguration(form) {
  return chPost('configuration/save', form)
}

export function editConfiguration(form) {
  return chPut('configuration', form)
}

export function deleteConfiguration(id) {
  return chDelete(`configuration/${id}`)
}
