
import { chGet } from '../index'

export function logList(param) {
  return chGet('/sys/log/page', param)
}
