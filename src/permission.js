import router from './router'
import store from './store'
// import Message from '@util/el-message'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/forgetPassword', '/register'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  console.log('token', hasToken)

  console.warn('请求地址', window.location.href)

  if (hasToken) {
    // console.log('有token', hasToken)
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      // const hasRoles = store.getters.roles && store.getters.roles.length > 0
      console.log('即将到', to, from)
      // NProgress.done()
      const permission_routes = store.getters.generated_routes
      // alert('即将到', JSON.stringify(to))
      if (permission_routes) {
        // alert('有路由表' + JSON.stringify(to))
        // console.log('路由', store.getters.permission_routes, store.getters.permission_routes.length)
        console.log('得到的路由表', permission_routes)
        console.log('已获取即将到', to, from)
        next()
      } else {
        try {
          console.log('未获取到路由表，准备获取用户信息')
          await store.dispatch('user/getInfo')
          console.log('准备加载路由')
          store.dispatch('permission/generateRoutes', []).then((res) => {
            console.log('接收到的路由######', res)
            router.addRoutes(res)
            console.log('合并路由', router)
            // next({ ...to, replace: true })
            console.log('from', from)
            console.log('to', to)
            console.log(res)
            if (res.length === 0) {
              next('/403')
            } else {
              // if (from.query.redirect && from.query.redirect !== '/403') {
              //   next(from.query.redirect)
              // }
              if (to.matched.length === 0) {
                router.push(to.path)
              }
              next()
            }

            // next({ path: '/404' })
            // next(to.redirectedFrom)
          })
        } catch (error) {
          await store.dispatch('user/resetToken')
          // Message.error('服务器错误')
          console.error(error)
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    // alert(JSON.stringify(whiteList))
    console.log('ppp', to.path)
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // alert('aaaaa')
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
