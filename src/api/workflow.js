import { chGet, chPost, chPut, chDelete } from './index'

export function gruopAllList() {
  return chGet('jyact/processDef/page')
}

export function addGruop(form) {
  return chPost('jyact/group', form)
}

export function editGruop(form) {
  return chPut('jyact/group', form)
}

export function deleteGruop(id) {
  return chDelete(`jyact/group/${id}`)
}

// 流程

export function workflowAllList() {
  return chGet('jyact/processDef/all')
}

export function workflowHistoryList(page = 1, limit = 10, defId = '') {
  return chGet('jyact/publish//page', {
    page, limit, defId
  })
}

export function workflowTaskList(page = 1, limit = 10) {
  return chGet('jyact/runJob/getJobList', {
    page, limit
  })
}

export function workflowJobList(page = 1, limit = 10) {
  return chGet('jyact/runJob/getTaskList', {
    page, limit
  })
}

export function getWorkNode(publishId) {
  return chGet(`jyact/runJob/getWorkNode/${publishId}`)
}

export function jumpNode(jobId, targetNode, conment) {
  return chPost(`jyact/runJob/turnTransition/${jobId}/${targetNode}`, {
    conment
  })
}

export function transferAssignee(form) {
  return chPost('jyact/runJob/transferAssignee', form)
}

export function addWorkflow(form) {
  return chPost('jyact/processDef', form)
}

export function publishWorkflow(defId) {
  return chPost(`jyact/publish/publishData/${defId}`)
}

export function editWorkflow(form) {
  return chPut('jyact/processDef', form)
}

export function moveWorkflow(form) {
  return chPost('jyact/processDef/mobileGroup', form)
}

export function deleteWorkflow(id) {
  return chDelete(`jyact/processDef/${id}`)
}

