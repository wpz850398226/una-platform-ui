import { chGet } from './index'

// 字典管理

export function dictionaryList() { // 获取字典列表
  return chGet('dictionary/all')
}

