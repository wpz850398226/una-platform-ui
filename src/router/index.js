import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },

  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/autologin',
    component: () => import('@/views/login/AutoLogin'),
    hidden: true
  },
  {
    path: '/forgetPassword',
    component: () => import('@/views/login/ForgetPassword'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/login/register'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    // alwaysShow: false,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/admin/index'),
        meta: { title: '首页', icon: 'dashboard', breadcrumb: false }
      }
    ]
  },

  // {
  //   path: '/map-query',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [
  //     {
  //       path: '/map-query',
  //       name: 'MapQuery',
  //       component: () => import('@/views/Extend/MapQuery'),
  //       meta: { title: '地图查询', icon: 'dashboard', breadcrumb: false }
  //     }
  //   ]
  // },
  // {
  //   path: '/mall-home',
  //   component: Layout,
  //   redirect: '/mall',
  //   children: [
  //     {
  //       path: '/mall',
  //       name: 'Mall',
  //       component: () => import('@/views/Extend/Mall'),
  //       meta: { title: '商城', icon: 'dashboard', breadcrumb: false }
  //     }
  //   ]
  // },
  // {
  //   path: '/workflow',
  //   component: Layout,
  //   redirect: '/workflow-home',
  //   children: [
  //     {
  //       path: '/workflow-home',
  //       name: 'Workflow',
  //       component: () => import('@/views/Base/WorkFlowManage'),
  //       meta: { title: '工作流', icon: 'dashboard', breadcrumb: false }
  //     }
  //   ]
  // },

  // {
  //   path: '/sys/systemManage',
  //   component: Layout,
  //   hidden: true,
  //   meta: { title: '系统设置' },
  //   children: [
  //     {
  //       path: '/manage/SysField',
  //       name: 'FieldManage',
  //       component: () => import('@/views/Base/FieldManage'),
  //       meta: { title: '字段管理1', breadcrumb: true, code: 'SysField' }
  //     }

  //   ]

  // },
  {
    path: '/403',
    component: () => import('@/views/403'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
  // 404 page must be placed at the end !!!
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
]

const createRouter = () =>
  new Router({
    mode: 'history', // require service support
    base: '/una/',
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
