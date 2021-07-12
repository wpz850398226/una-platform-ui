import { chGet, jsonPost, jsonPut } from '../index'

export function workflowList() {
  return chGet('/flow/definition/list')
}

export function creatInstance(definitionId) {
  return jsonPost('/flow/instance', { definitionId })
}

export function taskList(userId) {
  return chGet('/flow/task/page', {
    // 'in:candidateAccountId': userId,
    isNull: 'offTime',
    orderByDesc: 'activateTime'
  })
}

export function finishTask(form) {
  return jsonPut('/flow/task/handle', form)
}

