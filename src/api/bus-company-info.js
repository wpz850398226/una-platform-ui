import { chGet, chPost, chDelete } from './index'

export function busCompanyList(page = 1, limit = 10) {
  return chGet('jybase/busCompany/page', {
    page, limit
  })
}

export function addBusCompany(form) {
  // const rpc = { ...form }
  // rpc.leaderIdArray = ''
  return chPost('jybase/busCompany/addData', form)
}

export function busCompanyInfo(id) {
  return chGet(`jybase/busCompany/queryByCompanyId/${id}`)
}

export function deleteBusCompany(id) {
  return chDelete(`jybase/busCompany/${id}`)
}

