import { constantRoutes } from '@/router'
import { router_type } from '@/types/router'

const state: permission_type = {
  isSettingPermission: false, //是否已经设置了权限
  routes: [], //将过滤后的异步路由和静态路由集合
  addRoutes: [] //过滤后的异步路由
}

const mutations = {
  M_routes: (state: permission_type, routes: router_type | any) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  M_isSettingPermission: (state: permission_type, data: boolean) => {
    state.isSettingPermission = data
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
