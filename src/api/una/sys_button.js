
import { chGet, chDelete, jsonPut } from '../index'

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

