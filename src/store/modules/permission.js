// import Layout from '@/layout'
import { getUserMenu } from '@/api/user'
import {
  // asyncRoutes,
  constantRoutes } from '@/router'

// 前端路由表
const constantRouterComponents = {
  'Layout': () => import('@/layout'),
  'SysManage': () => import('@/views/Base/SysManage')
  // 'SysManage': () => import('@/views/Base/SysManage'),
  // 'SysEntityManage': () => import('@/views/Base/SysEntityManage')
}

// /**
//  * Use meta.role to determine if the current user has permission
//  * @param roles
//  * @param route
//  */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

// /**
//  * Filter asynchronous routing tables by recursion
//  * @param routes asyncRoutes
//  * @param roles
//  */
// export function filterAsyncRoutes(routes, roles) {
//   const res = []

//   routes.forEach(route => {
//     const tmp = { ...route }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRoutes(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })

//   return res
// }

const state = {
  routes: [],
  hasRoutes: false
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    // state.addRoutes = routes
    state.hasRoutes = true
    state.routes = constantRoutes.concat(routes)
  },
  RESET_PERMISSION: (state) => {
    state.hasRoutes = false
  }
}

const actions = {
  resetPermission({ commit }) {
    return new Promise(resolve => {
      commit('RESET_PERMISSION')
      resolve()
    })
  },
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      getUserMenu().then(response => {
        const { data } = response

        const routes = generator(data)

        routes.push({ path: '*', redirect: '/404', hidden: true })

        commit('SET_ROUTES', routes)
        resolve(routes)
      })
      // resolve(accessedRoutes)
    })
  }
}

const getComponent = (code, route, path) => {
  if (path.indexOf('sys/form') !== -1) {
    return () => import('@/views/Base/FormPage')
  }

  if (code === 'SysField') {
    return () => import('@/views/Base/FieldManage')
  } else if (code === 'CpGoods') {
    return () => import('@/views/Extend/Mall')
  }

  return constantRouterComponents[route]
}

const rmQuery = (path) => {
  return path.split('?')[0]
}

const getQuery = (path) => {
  const sp = path.split('?')
  if (sp.length === 2) {
    return sp[1]
  }
  return ''
}

const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const { name, type, spread, code, href, icon, path } = item || {}
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: `${rmQuery(item.path)}/${item.id}`,
      // path: item.path ? item.path.replace('/sys', '') : item.route + Math.random(),
      // 路由名称，建议唯一
      name: item.path || '',
      // 该路由对应页面的 组件 :方案1
      component: getComponent(item.code, item.route, item.path),

      // 该路由对应页面的 组件 :方案2 (动态加载)
      // component: (constantRouterComponents[item.component || item.key]) || (() => import(`@/views/${item.component}`)),

      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: name,
        icon: icon || undefined,
        noCache: true,
        type,
        href,
        code,
        path,
        query: getQuery(item.path)
      }
    }
    // // 是否设置了隐藏菜单
    // if (show === false) {
    //   currentRouter.hidden = true
    // }
    // 是否设置了隐藏子菜单
    if (!spread) {
      currentRouter.hideChildrenInMenu = true
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (currentRouter.path && !currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    currentRouter.path = '' + currentRouter.path
    //
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)

    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
