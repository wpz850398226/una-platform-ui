
import { chGet, chDelete } from '../index'

export function buttonList(param) {
  return chGet('/sys/button/page', param)
}

export function flushRedis() {
  return chDelete('/sys/redis/flush')
}
