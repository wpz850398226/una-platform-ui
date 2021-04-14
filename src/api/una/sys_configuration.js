import { chGet, chPost, chPut, chDelete } from '../index'
export function configurationList(page = 1, limit = 10) {
  return chGet('/sys/configuration/page', {
    page, limit
  })
}

export function configurationListAll() {
  return chGet('/sys/configuration/all')
}

export function addConfiguration(form) {
  return chPost('/sys/configuration/save', form)
}

export function editConfiguration(form) {
  return chPut('/sys/configuration', form)
}

export function deleteConfiguration(id) {
  return chDelete(`/sys/configuration/${id}`)
}
