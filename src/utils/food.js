import Cookies from 'js-cookie'

export function setCompanyId(token) {
  return Cookies.set('companyId', token)
}

export function getCompanyId() {
  return Cookies.get('companyId')
}
