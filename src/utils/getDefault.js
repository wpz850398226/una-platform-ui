import isNotEmpty from './isNotEmpty'

export default function getDefault(obj, key, df) {
  return ((obj === undefined || key === undefined || !isNotEmpty(obj[key])) ? df : obj[key])
}
