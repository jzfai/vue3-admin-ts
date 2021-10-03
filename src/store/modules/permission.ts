import { constantRoutes } from '@/router'
import { RouterTy } from '@/types/router'
import { PermissionTy } from '@/types/store'

const state: PermissionTy = {
  isSettingPermission: false, //是否已经设置了权限
  routes: [], //将过滤后的异步路由和静态路由集合
  addRoutes: [] //过滤后的异步路由
}
const mutations = {
  M_routes: (state: PermissionTy, routes: RouterTy) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  M_isSettingPermission: (state: PermissionTy, data: boolean) => {
    state.isSettingPermission = data
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
