import store from '@/store'

export function dictionaryInfo(value) {
  if (value) {
    const elements = store.getters && store.getters.dictionary

    const res = elements.reduce((t, v) => v.id === parseInt(value) ? [...t, v] : t, [])
    return res.length > 0 ? res[0] : ''
  } else {
    console.error('字典未携带查询参数')
    return ''
  }
}

export function dictionaryCodeInfo(value) {
  if (value) {
    const elements = store.getters && store.getters.dictionary

    const res = elements.reduce((t, v) => v.val === value ? [...t, v] : t, [])
    return res.length > 0 ? res[0] : ''
  } else {
    console.error('字典未携带查询参数')
    return ''
  }
}

export function findDictionary(value) {
  if (value) {
    const elements = store.getters && store.getters.dictionary

    const res = elements.reduce((t, v) => v.val === value ? [...t, v] : t, [])
    return res.length > 0 ? res[0].name : ''
  } else {
    console.error('字典未携带查询参数')
    return ''
  }
}

export function findDictionaryList(pid) {
  if (pid) {
    const elements = store.getters && store.getters.dictionary

    const res = elements.reduce((t, v) => v.code === pid ? [...t, v] : t, [])
    console.log(res, 'kkkkkssss')
    if (res.length > 0) {
      return res[0].children
    }
    return []
  } else {
    console.error('字典未携带查询参数')
    return ''
  }
}
