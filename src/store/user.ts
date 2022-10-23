import { loginReq, logoutReq, getInfoReq } from '@/api/user'
import { setToken, removeToken } from '@/utils/auth'
import { ObjTy } from '~/common'
import router, { constantRoutes, asyncRoutes } from '@/router'
import { defineStore } from 'pinia'
import { usePermissionStore } from '@/store/permission'
import { useTagsViewStore } from '@/store/tagsView'
import settings from '@/settings'

const resetRouter = () => {
  const asyncRouterNameArr: Array<any> = asyncRoutes.map((mItem) => mItem.name)
  asyncRouterNameArr.forEach((name) => {
    if (router.hasRoute(name)) {
      router.removeRoute(name)
    }
  })
}

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      username: '',
      avatar: '',
      userInfo: {
        id: null
      },
      roles: [] as Array<string>
    }
  },

  actions: {
    login(data) {
      return new Promise((resolve, reject) => {
        loginReq(data)
          .then(({ data }) => {
            //存储用户信息
            this.$patch((state) => {
              state.userInfo = data.userInfo
              state.username = data.userInfo
              state.avatar = data.userInfo.headImgUrl
            })
            setToken(data?.jwtToken)
            resolve(null)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // get user info
    getUserInfo() {
      return new Promise<Array<ObjTy>>((resolve, reject) => {
        getInfoReq(settings.plateFormId)
          .then(({ data }) => {
            if (!data) {
              return reject('Verification failed, please Login again.')
            }
            const { roleCodeArr, menuList } = data
            this.$patch((state) => {
              state.roles = roleCodeArr
            })
            resolve(menuList)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // user logout
    logout() {
      return new Promise((resolve, reject) => {
        logoutReq()
          .then(() => {
            this.resetState()
            resolve(null)
          })
          .catch((error: any) => {
            reject(error)
          })
      })
    },
    resetState() {
      return new Promise((resolve) => {
        removeToken() // must remove  token  first
        resetRouter() // reset the router
        const permissionStore = usePermissionStore()
        permissionStore.setGetUserInfo(false)
        const tagsViewStore = useTagsViewStore()
        tagsViewStore.delAllViews()
        resolve(null)
      })
    }
  }
})
