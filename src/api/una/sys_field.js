import { chGet, chPost } from '../index'
export function getDisplayValue(map) {
  return chPost('/sys/field/getDisplayValue', map)
}

export function fieldList(param) {
  return chGet('/sys/field/queryPlural', param)
}
