import setting from '@/settings'
import { RouterTy, RouteItemTy } from '~/router'
import { ObjTy } from '~/common'

interface tagsViewTy {
  visitedViews: RouterTy
}

const state = {
  visitedViews: []
}

const mutations = {
  ADD_VISITED_VIEW: (state: tagsViewTy, view: any) => {
    if (state.visitedViews.some((v) => v.path === view.path)) return
    //limit num
    if (state.visitedViews.length >= setting.tagsViewNum) {
      state.visitedViews.pop()
      state.visitedViews.push(
        Object.assign({}, view, {
          title: view.meta.title || 'no-name'
        })
      )
    } else {
      state.visitedViews.push(
        Object.assign({}, view, {
          title: view.meta.title || 'no-name'
        })
      )
    }
  },
  DEL_VISITED_VIEW: (state: tagsViewTy, view: any) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        break
      }
    }
  },

  DEL_OTHERS_VISITED_VIEWS: (state: tagsViewTy, view: any) => {
    state.visitedViews = state.visitedViews.filter((v: any) => {
      return v.meta.affix || v.path === view.path
    })
  },

  DEL_ALL_VISITED_VIEWS: (state: tagsViewTy) => {
    // keep affix tags
    state.visitedViews = state.visitedViews.filter((tag: RouteItemTy) => tag.meta?.affix)
  },

  UPDATE_VISITED_VIEW: (state: tagsViewTy, view: any) => {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  }
}

const actions = {
  addView({ dispatch }: ObjTy, view: any) {
    dispatch('addVisitedView', view)
  },
  addVisitedView({ commit }: ObjTy, view: any) {
    commit('ADD_VISITED_VIEW', view)
  },

  delView({ dispatch, state }: ObjTy, view: any) {
    return new Promise((resolve) => {
      dispatch('delVisitedView', view)
      resolve({
        visitedViews: [...state.visitedViews]
      })
    })
  },
  delVisitedView({ commit, state }: ObjTy, view: any) {
    return new Promise((resolve) => {
      commit('DEL_VISITED_VIEW', view)
      resolve([...state.visitedViews])
    })
  },
  delOthersViews({ dispatch, state }: ObjTy, view: RouteItemTy) {
    return new Promise((resolve) => {
      dispatch('delOthersVisitedViews', view)
      resolve({
        visitedViews: [...state.visitedViews]
      })
    })
  },
  delOthersVisitedViews({ commit, state }: ObjTy, view: RouteItemTy) {
    return new Promise((resolve) => {
      commit('DEL_OTHERS_VISITED_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },

  delAllViews({ dispatch, state }: ObjTy, view: RouteItemTy) {
    return new Promise((resolve) => {
      dispatch('delAllVisitedViews', view)
      resolve({
        visitedViews: [...state.visitedViews]
      })
    })
  },
  delAllVisitedViews({ commit, state }: ObjTy) {
    return new Promise((resolve) => {
      commit('DEL_ALL_VISITED_VIEWS')
      resolve([...state.visitedViews])
    })
  },

  updateVisitedView({ commit }: ObjTy, view: RouteItemTy) {
    commit('UPDATE_VISITED_VIEW', view)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
