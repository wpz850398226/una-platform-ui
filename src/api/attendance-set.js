import { chGet, chPost, chPut, chDelete } from './index'

export function attendanceSet(companyId) {
  return chGet(`jyattendance/attendanceSet/getAttendanceSet/${companyId}`)
}

export function addAttendanceSet(form) {
  return chPost('jyattendance/attendanceSet', form)
}

export function editAttendanceSet(form) {
  return chPut('jyattendance/attendanceSet', form)
}

export function deleteAttendanceSet(companyId) {
  return chDelete(`jyattendance/attendanceSet/deleteData/${companyId}`)
}

