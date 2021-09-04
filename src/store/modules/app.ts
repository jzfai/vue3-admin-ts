const state: app_type = {
  sidebar: {
    opened: true
  },
  device: 'desktop',
  cachedViews: ['DemoTest']
}

const mutations = {
  /*建议规范全部以M_开头来表示是mutation，以A_开头来表示action*/
  M_sidebar_opened: (state: app_type, data: boolean) => {
    state.sidebar.opened = data
  },
  M_toggleSideBar: (state: app_type) => {
    state.sidebar.opened = !state.sidebar.opened
  },

  /*keepAlive缓存*/
  M_ADD_CACHED_VIEW: (state: app_type, view: string) => {
    if (state.cachedViews.includes(view)) return
    state.cachedViews.push(view)
  },

  M_DEL_CACHED_VIEW: (state: app_type, view: string) => {
    const index = state.cachedViews.indexOf(view)
    index > -1 && state.cachedViews.splice(index, 1)
  },
  M_RESET_CACHED_VIEW: (state: app_type) => {
    state.cachedViews = []
  }
}
const actions = {
  A_sidebar_opened({ commit }: any, data: boolean) {
    commit('M_sidebar_opened', data)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
