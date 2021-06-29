import { chGet } from '../index'

export function getTemplateData(entityId, id) {
  return chGet(`/sys/article/showInTemplate/${entityId}/${id}`)
}
