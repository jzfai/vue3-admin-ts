import { defineStore } from 'pinia'
import { RouteItemTy, RouterRowTy, RouterTy } from '~/router'
import { asyncRoutes, constantRoutes } from '@/router'
import { PermissionTy } from '~/store'
import { ObjTy } from '~/common'
import Layout from '@/layout'

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

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
const buttonCodes: Array<string> = []
export function filterRoutesByMenuListList(menuList: Array<ObjTy>) {
  const filterRouter: RouterTy = []
  menuList.forEach((route) => {
    //button permission
    if (route.category === 3) {
      buttonCodes.push(route.code)
    } else {
      //generator every router item by menuList
      const itemFromReqRouter: any = getRouteItemFromReqRouter(route)
      if (route.children?.length) {
        //judge  the type is router or button
        itemFromReqRouter.children = filterRoutesByMenuListList(route.children)
      }
      filterRouter.push(itemFromReqRouter)
    }
  })
  return filterRouter
}
const getRouteItemFromReqRouter = (route) => {
  const tmp = { meta: {} } as { meta: ObjTy }
  const routeKeyArr = ['path', 'component', 'redirect', 'alwaysShow', 'name', 'hidden']
  const metaKeyArr = ['title', 'activeMenu', 'elSvgIcon', 'icon']
  const modules = import.meta.glob('../views/**/**.vue')
  //generator routeKey
  routeKeyArr.forEach((fItem) => {
    if (fItem === 'component') {
      if (route[fItem] === 'Layout') {
        tmp[fItem] = Layout
      } else {
        //has error , i will fix it through plugins
        //tmp[fItem] = () => import(`@/views/permission-center/test/TestTableQuery.vue`)
        tmp[fItem] = modules[`../views/${route[fItem]}`]
      }
    } else if (fItem === 'path' && route.parentId === 0) {
      tmp[fItem] = `/${route[fItem]}`
    } else if (['hidden', 'alwaysShow'].includes(fItem)) {
      tmp[fItem] = !!route[fItem]
    } else if (['name'].includes(fItem)) {
      tmp[fItem] = route['code']
    } else if (route[fItem]) {
      tmp[fItem] = route[fItem]
    }
  })
  //generator metaKey
  metaKeyArr.forEach((fItem) => {
    if (route[fItem]) tmp.meta[fItem] = route[fItem]
  })
  //route extra insert
  if (route.extra) {
    Object.entries(route.extra.parse(route.extra)).forEach(([key, value]) => {
      if (key === 'meta') {
        tmp.meta[key] = value
      } else {
        tmp[key] = value
      }
    })
  }
  return tmp
}

export const usePermissionStore = defineStore('permission', {
  /***
   *类似于组件的 data数据的 ,用来存储全局状态的
   * 1、必须是箭头函数
   */
  state: () => {
    return {
      isGetUserInfo: false, // get userInfo
      routes: [], //将过滤后的异步路由和静态路由集合
      addRoutes: [], //过滤后的异步路由
      buttonCodes: [] //过滤后的按钮权限数组
    } as PermissionTy
  },

  /***
   *封装处理数据的函数（业务逻辑)：修改数据
   */
  actions: {
    setRoutes(routes: RouterTy) {
      this.$patch((state) => {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
      })
    },
    setGetUserInfo(data: boolean) {
      this.$patch((state) => {
        state.isGetUserInfo = data
      })
    },
    generateRoutes(menuList: Array<ObjTy>) {
      return new Promise(async (resolve) => {
        // if (settings.permissionMode === 'roles') {
        //   //filter by role
        //   if (roles.includes('admin')) {
        //     accessedRoutes = asyncRoutes || []
        //   } else {
        //     accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        //   }
        // } else {
        //   //filter by codeArr
        //   //req code arr
        //   let codeArr: any = localStorage.getItem('codeArr')
        //   if (codeArr) {
        //     codeArr = JSON.parse(codeArr)
        //   } else {
        //     localStorage.setItem('codeArr', JSON.stringify([1]))
        //     codeArr = localStorage.getItem('codeArr')
        //   }
        //   accessedRoutes = await filterRouterByCodeArr(codeArr, asyncRoutes)
        // }
        const filterRouter = filterRoutesByMenuListList(menuList)
        //save buttonCodes to pinia
        this.$patch((state) => {
          state.buttonCodes = buttonCodes
        })
        resolve(filterRouter)
      })
    }
  }
})
