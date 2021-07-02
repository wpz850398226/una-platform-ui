
import { chGet } from '../index'

export function companyList(param) {
  return chGet('/sys/company/list', param)
}
