import { ObjTy } from '~/common'
import { AppTy } from '~/store'
import defaultSettings from '@/settings'
const state: AppTy = {
  sidebar: {
    opened: true
  },
  device: 'desktop',
  settings: defaultSettings,
  cachedViews: [],
  cachedViewsDeep: []
}

/*mutations建议以M_开头*/
const mutations = {
  /*
   * data:ObjType
   * such as {sidebarLogo:false}
   * */
  M_settings: (state: AppTy, data: ObjTy) => {
    state.settings = { ...state.settings, ...data }
  },
  M_sidebar_opened: (state: AppTy, data: boolean) => {
    state.sidebar.opened = data
  },
  M_toggleSideBar: (state: AppTy) => {
    state.sidebar.opened = !state.sidebar.opened
  },

  /*keepAlive缓存*/
  M_ADD_CACHED_VIEW: (state: AppTy, view: string) => {
    if (state.cachedViews.includes(view)) return
    state.cachedViews.push(view)
  },

  M_DEL_CACHED_VIEW: (state: AppTy, view: string) => {
    const index = state.cachedViews.indexOf(view)
    index > -1 && state.cachedViews.splice(index, 1)
  },
  M_RESET_CACHED_VIEW: (state: AppTy) => {
    state.cachedViews = []
  },
  /*third  keepAlive*/
  M_ADD_CACHED_VIEW_DEEP: (state, view) => {
    if (state.cachedViewsDeep.includes(view)) return
    state.cachedViewsDeep.push(view)
  },
  M_DEL_CACHED_VIEW_DEEP: (state, view) => {
    const index = state.cachedViewsDeep.indexOf(view)
    index > -1 && state.cachedViewsDeep.splice(index, 1)
  },
  M_RESET_CACHED_VIEW_DEEP: (state) => {
    state.cachedViewsDeep = []
  }
}
const actions = {
  A_sidebar_opened({ commit }: ObjTy, data: boolean) {
    commit('M_sidebar_opened', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
