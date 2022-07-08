import defaultSettings from '@/settings'
import { defineStore } from 'pinia'
import { SettingTy } from '~/common'
export const useAppStore = defineStore('app', {
  /***
   *类似于组件的 data数据的 ,用来存储全局状态的
   * 1、必须是箭头函数
   */
  state: () => {
    return {
      sidebar: { opened: true },
      device: 'desktop',
      settings: defaultSettings as SettingTy,
      cachedViews: [] as Array<string>,
      cachedViewsDeep: [] as Array<string>
    }
  },

  /***
   *封装处理数据的函数（业务逻辑)：修改数据
   */
  actions: {
    M_settings(data) {
      this.settings = { ...this.settings, ...data }
    },
    M_sidebar_opened(data: boolean) {
      this.sidebar.opened = data
    },
    M_toggleSideBar() {
      this.sidebar.opened = !this.sidebar.opened
    },

    /*keepAlive缓存*/
    M_ADD_CACHED_VIEW(view) {
      this.$patch((state) => {
        if (state.cachedViews.includes(view)) return
        state.cachedViews.push(view)
      })
    },

    M_DEL_CACHED_VIEW(view) {
      this.$patch((state) => {
        const index = state.cachedViews.indexOf(view)
        index > -1 && state.cachedViews.splice(index, 1)
      })
    },
    M_RESET_CACHED_VIEW() {
      this.$patch((state) => {
        state.cachedViews = []
      })
    },
    /*third  keepAlive*/
    M_ADD_CACHED_VIEW_DEEP(view) {
      this.$patch((state) => {
        if (state.cachedViewsDeep.includes(view)) return
        state.cachedViewsDeep.push(view)
      })
    },
    M_DEL_CACHED_VIEW_DEEP(view) {
      this.$patch((state) => {
        const index = state.cachedViewsDeep.indexOf(view)
        index > -1 && state.cachedViewsDeep.splice(index, 1)
      })
    },
    M_RESET_CACHED_VIEW_DEEP() {
      this.$patch((state) => {
        state.cachedViewsDeep = []
      })
    },

    A_sidebar_opened(data: boolean) {
      this.M_sidebar_opened(data)
    }
  }
})
