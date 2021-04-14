import { chGet, chPost, chPut, chDelete } from './index'

export function teamOnLineList() {
  return chGet('websocket/msg/getOnline')
}

export function teamList(page = 1, limit = 10) {
  return chGet('jyteam/team/page', {
    page, limit
  })
}

export function addTeam(form) {
  return chPost('jyteam/team', form)
}

export function editTeam(form) {
  return chPut('jyteam/team', form)
}

export function deleteTeam(id) {
  return chDelete(`jyteam/team/${id}`)
}

export function bookList(page = 1, limit = 10, companyId = '') {
  return chGet('jyteam/teamBook/page', {
    page, limit, companyId
  })
}

export function addBook(form) {
  return chPost('jyteam/teamBook', form)
}

export function editBook(form) {
  return chPut('jyteam/teamBook', form)
}

export function deleteBook(id) {
  return chDelete(`jyteam/teamBook/${id}`)
}

export function ebookList(page = 1, limit = 10, companyId = '') {
  return chGet('jyteam/teamNewspaper/page', {
    page, limit, companyId
  })
}

export function addEBook(form) {
  return chPost('jyteam/teamNewspaper', form)
}

export function editEBook(form) {
  return chPut('jyteam/teamNewspaper', form)
}

export function deleteEBook(id) {
  return chDelete(`jyteam/teamNewspaper/${id}`)
}
