/*
 * @Author: your name
 * @Date: 2020-06-23 21:15:05
 * @LastEditTime: 2020-09-27 15:14:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ch-uiap-ui/src/store/modules/user.js
 */
// logout
import { login, getInfo, getElements, phoneLogin } from '@/api/user'
import { dictionaryList } from '@/api/dictionary'
import { entityListAll } from '@/api/una/sys_entity'
import { configurationListAll } from '@/api/una/sys_configuration'
import { getToken, setToken, removeToken, getTentId, setTentId, removeTentId, getAppKey, setAppKey, removeAppKey } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    tentId: getTentId(),
    appKey: getAppKey(),
    userinfo: {},
    username: '',
    name: '',
    avatar: '',
    roles: [],
    elements: [],
    configurations: [],
    entitys: [],
    dictionary: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_TentId: (state, tendId) => {
    state.tentId = tendId
  },
  SET_AppKey: (state, appKey) => {
    state.appKey = appKey
  },
  SET_USERINFO: (state, userinfo) => {
    state.userinfo = userinfo
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ELEMENTS: (state, elements) => {
    state.elements = elements
  },
  SET_CONFIG: (state, configurations) => {
    state.configurations = configurations
  },
  SET_ENTITY: (state, entitys) => {
    state.entitys = entitys
  },
  SET_DICTIONARY: (state, dictionary) => {
    state.dictionary = dictionary
  }

}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        console.log(data, 'kkkkkk')
        commit('SET_TOKEN', data)
        setToken(data)

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // phonelogin
  phoneLogin({ commit }, userInfo) {
    const { telPhone, code } = userInfo
    return new Promise((resolve, reject) => {
      phoneLogin({ telPhone: telPhone.trim(), code: code, appkey: 'uUdTluWpcZzkf4Yyog0FPuXXvoue0saO' }).then(response => {
        console.log(response)
        const { data } = response
        if (data.code === '200') {
          commit('SET_TOKEN', data.Authorization)
          commit('SET_TentId', data.tentId)
          commit('SET_AppKey', data.appKey)
          setToken(data.Authorization)
          setTentId(data.tentId)
          setAppKey(data.appKey)
          resolve()
        } else {
          reject('验证码错误')
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        console.log(response, '888')

        if (!data) {
          reject('信息校验失败, 请重新登录.1')
        }
        // roles,
        const { username, name, attr1 } = data

        commit('SET_USERINFO', data)
        commit('SET_USERNAME', username)
        commit('SET_NAME', name)
        // commit('SET_AVATAR', attr1)

        // 2020-01-28 影响用户正常登陆
        // getCompanyId(data.organizationList[0].companyId) // 禁止使用Cookie

        // resolve()
        getElements(state.token).then(res => {
          console.warn('按钮权限结果', res)
          const datas = res.data
          if (!datas) {
            reject('信息校验失败, 请重新登录.2')
          }
          console.warn(datas, '按钮权限')
          commit('SET_ELEMENTS', datas)

          configurationListAll().then((resk) => {
            // console.log('系统配置项', resk.data)
            commit('SET_CONFIG', resk.data)
          })

          entityListAll().then((resk) => {
            console.log('实体类', resk)
            commit('SET_ENTITY', resk)
            dictionaryList().then((resk) => {
              commit('SET_DICTIONARY', resk)
              resolve()
            })
          })
        })
      }).catch(error => {
        reject(error)
      })
    })
  },

  refreshElement({ commit, state }) {
    return new Promise((resolve, reject) => {
      getElements(state.token).then(res => {
        console.warn('按钮权限结果', res)
        const datas = res.data
        if (!datas) {
          reject('信息校验失败, 请重新登录.')
        }
        console.warn(datas, '按钮权限')
        commit('SET_ELEMENTS', datas)
        resolve()
      })
    })
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeAppKey()
      removeTentId()
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      commit('tagsView/DEL_ALL_VISITED_VIEWS', '', { root: true })
      commit('tagsView/DEL_ALL_CACHED_VIEWS', '', { root: true })
      resolve()
      // logout(state.token).then(() => {
      //   removeToken() // must remove  token  first
      //   resetRouter()
      //   commit('RESET_STATE')
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeAppKey()
      removeTentId()
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

