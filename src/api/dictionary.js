/*
 * @Author: Cui
 * @Date: 2020-09-23 10:20:42
 * @LastEditTime: 2020-09-23 10:30:21
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /ch-uiap-ui/src/api/dictionary.js
 */
// import { chGet, chPost, chDelete, chPut} from './index'
import { chGet, chPost, chPut } from './index'

// 字典管理

export function dictionaryTree(effectScope = 'uUdTluWpcZzkf4Yyog0FPuXXvoue0saO') { // 获取字典树
  return chGet('admin/dictionary/getDictionaryTree', {
    effectScope
  })
}

export function dictionaryList(effectScope = 'uUdTluWpcZzkf4Yyog0FPuXXvoue0saO') { // 获取字典列表
  return chGet('sys/dictionary/all', {
    effectScope
  })
}

export function addDictionary(form) { // 新增字典
  return chPost('admin/dictionary', form)
}

export function editDictionary(form) { // 修改字典
  return chPut('admin/dictionary', form)
}

export function findDictionary(pid) {
  return chGet(`admin/dictionary/getDicByPid/${pid}`)
}

