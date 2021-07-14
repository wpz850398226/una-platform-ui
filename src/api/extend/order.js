
import { chGet } from '../index'

export function orderList(param) {
  return chGet('/cp/order/page', param)
}
