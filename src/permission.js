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

  if (hasToken) {
    //
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      // const hasRoles = store.getters.roles && store.getters.roles.length > 0

      // NProgress.done()
      const permission_routes = store.getters.generated_routes
      // alert('即将到', JSON.stringify(to))
      if (permission_routes) {
        // alert('有路由表' + JSON.stringify(to))
        //

        next()
      } else {
        try {
          await store.dispatch('user/getInfo')

          store.dispatch('permission/generateRoutes', []).then((res) => {
            router.addRoutes(res)

            // next({ ...to, replace: true })

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
