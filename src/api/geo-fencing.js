import { chGet, chPost, chPut, chDelete } from './index'
export function geoFenceList(companyId) {
  return chGet(`jyattendance/geogFence/getGeographicalFence/${companyId}`)
}

export function addGeoFence(form) {
  return chPost('jyattendance/geogFence', form)
}

export function editGeoFence(form) {
  return chPut('jyattendance/geogFence', form)
}

export function deleteGeoFence(id) {
  return chDelete(`jyattendance/geogFence/${id}`)
}

