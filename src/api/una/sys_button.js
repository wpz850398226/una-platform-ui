
import { chGet } from '../index'

export function buttonList(param) {
  return chGet('/sys/button/page', param)
}
