import { chGet, chPost } from '../index'
export function getDisplayValue(map) {
  return chPost('/field/getDisplayValue', map)
}

export function fieldList(param) {
  return chGet('/sys/field/list', param)
}
