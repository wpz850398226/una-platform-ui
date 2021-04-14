import store from '@/store'

export function getEntity(className) {
  console.log(store.getters.entitys, 'xxxxxxxxxxxeeeeeeeee')
  if (className) {
    const entitys = store.getters && store.getters.entitys

    const res = entitys.reduce((t, v) => v.code === className ? [...t, v] : t, [])
    return res.length > 0 ? res[0] : ''
  } else {
    console.error('查询实体失败')
    return ''
  }
}

// export function getFieldList(className) {
//   if (className) {
//     const entitys = store.getters && store.getters.entitys
//
//     const res = entitys.reduce((t, v) => v.className === className ? [...t, v] : t, [])
//     return res.length > 0 ? res[0].fieldList : ''
//   } else {
//     console.error('查询字段失败')
//     return ''
//   }
// }

export function findDictionaryList(pid) {
  if (pid) {
    const elements = store.getters && store.getters.dictionary

    const res = elements.reduce((t, v) => v.parentId === pid ? [...t, v] : t, [])
    return res
  } else {
    console.error('字典未携带查询参数')
    return ''
  }
}
