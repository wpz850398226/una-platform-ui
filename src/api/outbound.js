import {
  chGet,
  chPost
} from './index'

import {
  getToken,
  getTentId,
  getAppKey
} from '@/utils/auth'

import axios from 'axios'

// 外访管理

export function departmentAllList(companyId = '') {
  return chGet('jyoutbound/outboundSettings/loadDeptList', {
    companyId
  })
}

export function personListByDeptId(deptId) {
  return chGet(`jyoutbound/outboundSettings/loadUserList/${deptId}`)
}

export function setGuestSetting(form) {
  return chPost('jyoutbound/outboundSettings/addSettings', form)
}

export function getGuestSetting() {
  return chGet('jyoutbound/outboundSettings/getSysSettings')
}

export function setGuestLimit(form) { // 设置用户接访限制数量
  return chPost('jyoutbound/outboundUserBind/setLimit', form)
}

export function applyList(form) { // 获取申请单列表
  return chGet('jyoutbound/outboundApply/applyList', form)
}

export function approvalList(form) { // 获取审批请单列表
  return chGet('jyoutbound/outboundApply/allApply', form)
}

export function applyDetail(applyId) {
  return chGet(`jyoutbound/outboundApply/applyDetail/${applyId}`)
}

export function applyInfo(form) {
  return chGet('jyoutbound/outboundApply/applyInfo', form)
}

export function setApplyState(id, applyState, refuseCause = '', cancelTypeId = '') { // 审批接口 0-审核中  1-通过   2-拒绝
  return chPost('jyoutbound/outboundApply/checkApply', {
    id,
    applyState,
    refuseCause,
    cancelTypeId
  })
}

export function workPlan(form) { // 查询工作安排
  return chPost('jyoutbound/outboundWorkPlan/getWorkPlan', form)
}

export function addWorkPlan(form) { // 添加工作安排
  return chPost('jyoutbound/outboundWorkPlan/addWork', form)
}

export function getCollectChartDate(form) {
  return chGet('jyoutbound/outboundApply/collectApply', form)
}

export function exportExcel() {
  return chDownloadAS('jyoutbound/outboundApply/exportCollect', '外访记录.xlsx')
}

export async function chDownloadAS(downloadUrl, filename) {
  if (!downloadUrl) {
    return
  }
  const blob = await chDownloadA(downloadUrl)
  const url = window.URL.createObjectURL(new Blob([blob]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

async function chDownloadA(url) {
  console.log('chDownload')
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `/api/${url}`,
      responseType: 'blob',
      headers: {
        'Authorization': getToken(),
        'tentId': getTentId(),
        'appKey': getAppKey()
      }
    }).then((res) => {
      resolve(res.data)
    }).catch((err) => {
      this.$message.error('与服务器通信异常')
      reject(err)
    })
  })
}
