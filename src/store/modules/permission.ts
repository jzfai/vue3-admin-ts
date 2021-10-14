import { constantRoutes, asyncRoutes } from '@/router'
import settings from '@/settings'
import { PermissionTy } from '@/types/store'
import { RouteItemTy, RouterRowTy, RouterTy } from '@/types/router'
import { ObjTy } from '@/types/common'

/**
 * Use meta.code to determine if the current user has permission
 * @param codeArr
 * @param routeItem
 */
function hasCodePermission(codeArr: Array<number>, routeItem: RouteItemTy) {
  if (routeItem.meta && routeItem.meta.code) {
    return codeArr.includes(routeItem.meta.code) || routeItem.hidden
  } else {
    return true
  }
}
/**
 * Use meta.code to determine if the current user has permission
 * @param codeArr
 * @param asyncRoutes
 */
function filterRouterByCodeArr(codeArr: Array<number>, asyncRoutes: RouterTy): Promise<RouterTy> {
  return new Promise((resolve) => {
    const filterRouter: RouterTy = []
    asyncRoutes.forEach(async (routeItem: RouterRowTy) => {
      if (hasCodePermission(codeArr, routeItem)) {
        if (routeItem.children) {
          routeItem.children = await filterRouterByCodeArr(codeArr, routeItem.children)
        }
        filterRouter.push(routeItem)
      }
    })
    resolve(filterRouter)
  })
}

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles: Array<string>, route: RouteItemTy) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta?.roles?.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes: RouterTy, roles: Array<string>) {
  const res: RouterTy = []
  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state: PermissionTy = {
  isGetUserInfo: false, // get userInfo
  routes: [], //将过滤后的异步路由和静态路由集合
  addRoutes: [] //过滤后的异步路由
}

const actions = {
  generateRoutes({ commit }: ObjTy, roles: Array<string>) {
    return new Promise(async (resolve) => {
      let accessedRoutes
      if (settings.permissionMode === 'roles') {
        //filter by role
        if (roles.includes('admin')) {
          accessedRoutes = asyncRoutes || []
        } else {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        }
      } else {
        //filter by codeArr
        //req code arr
        let codeArr: any = localStorage.getItem('codeArr')
        if (codeArr) {
          codeArr = JSON.parse(codeArr)
        } else {
          localStorage.setItem('codeArr', JSON.stringify([1]))
          codeArr = localStorage.getItem('codeArr')
        }
        accessedRoutes = await filterRouterByCodeArr(codeArr, asyncRoutes)
      }
      commit('M_routes', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

const mutations = {
  M_routes: (state: PermissionTy, routes: RouterTy) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  M_isGetUserInfo: (state: PermissionTy, data: boolean) => {
    state.isGetUserInfo = data
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
