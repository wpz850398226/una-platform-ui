
import { chGet, chDelete, jsonPut, jsonPost } from '../index'

export function buttonList(param) {
  return chGet('/sys/button/page', param)
}

export function flushRedis() {
  return chDelete('/sys/redis/flush')
}

export function stickGoods(id) {
  return jsonPut(`/cp/goods/stick/${id}`)
}

export function refreshGoods(id) {
  return jsonPut(`/cp/goods/refresh/${id}`)
}

export function stickShop(id) {
  return jsonPut(`/cp/shop/stick/${id}`)
}

export function refreshShop(id) {
  return jsonPut(`/cp/shop/refresh/${id}`)
}

// 考勤打卡
export function attendancePunch(coord) {
  return jsonPut(`/oa/attendance/punch/${coord}`)
}

export function autoAttendance() {
  return jsonPost(`/oa/attendance/auto`)
}

export function articleSee(entityId, id) {
  return chGet(`/sys/article/showInTemplate/${entityId}/${id}`)
}

