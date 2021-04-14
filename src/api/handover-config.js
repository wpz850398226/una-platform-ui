import { chGet, chPost } from './index'

export function getHandoverConfig() {
  return chGet('jylayout/overSentryConf/getConf')
}

export function getPatrolConfig() {
  return chGet('jylayout/patrolSentryConf/getConf')
}

export function setHandoverConfig(form) {
  return chPost('jylayout/overSentryConf', form)
}

export function setPatrolConfig(form) {
  return chPost('jylayout/patrolSentryConf', form)
}
