import { chGet } from './index'
//  chPost, chPut, chDelete

export function attendanceList(page = 1, limit = 10, queryFields) {
  return chGet('jyattendance/attendanceInfo/getInfoList', {
    page, limit, ...queryFields
  })
}

export function leaveList(page = 1, limit = 10, queryFields) {
  return chGet('jyattendance/leave/getLeaveByParam', {
    page, limit, ...queryFields
  })
}

export function exportLeaveList(form) {
  return chGet('jyattendance/leave/generateReport', {
    ...form
  })
}

export function exportCancelLeaveList(form) {
  return chGet('jyattendance/eliminateLeave/generateReport', {
    ...form
  })
}

export function cancelLeaveList(page = 1, limit = 10, queryFields) {
  return chGet('jyattendance/eliminateLeave/getEleave', {
    page, limit, ...queryFields
  })
}
