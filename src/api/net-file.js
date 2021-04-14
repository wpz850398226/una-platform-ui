
import { chGet } from './index'

export function fileList(page = 1, limit = 10, originalTitle = '') {
  return chGet('jyteam/sysFile/page', {
    page, limit, originalTitle
  })
}
