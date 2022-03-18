import { loginReq, logoutReq, getInfoReq } from '@/api/user'
import { setToken, removeToken } from '@/utils/auth'
import { UserTy } from '~/store'
import { ObjTy } from '~/common'
import router, { constantRoutes, asyncRoutes } from '@/router'

//当路由被删除时，所有的别名和子路由也会被同时删除
//https://router.vuejs.org/zh/guide/advanced/dynamic-routing.html#%E5%88%A0%E9%99%A4%E8%B7%AF%E7%94%B1
const resetRouter = () => {
  const asyncRouterNameArr: Array<any> = asyncRoutes.map((mItem) => mItem.name)
  asyncRouterNameArr.forEach((name) => {
    if (router.hasRoute(name)) {
      router.removeRoute(name)
    }
  })
}

const getDefaultState = () => {
  return {
    //token: getToken(),
    username: '',
    avatar: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  M_username: (state: UserTy, username: string) => {
    state.username = username
  },
  M_roles: (state: UserTy, roles: Array<string>) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login({ commit }: ObjTy, data: ObjTy) {
    return new Promise((resolve, reject) => {
      loginReq(data)
        .then((res: ObjTy) => {
          if (res.code === 20000) {
            //commit('SET_Token', res.data?.jwtToken)
            setToken(res.data?.jwtToken)
            resolve(null)
          } else {
            reject(res)
          }
        })
        .catch((error: any) => {
          reject(error)
        })
    })
  },
  // get user info
  getInfo({ commit }: ObjTy) {
    return new Promise((resolve, reject) => {
      getInfoReq()
        .then((response: ObjTy) => {
          const { data } = response
          if (!data) {
            return reject('Verification failed, please Login again.')
          }
          //此处模拟数据
          const rolesArr: any = localStorage.getItem('roles')
          if (rolesArr) {
            data.roles = JSON.parse(rolesArr)
          } else {
            data.roles = ['admin']
            localStorage.setItem('roles', JSON.stringify(data.roles))
          }
          const { roles, username } = data
          commit('M_username', username)
          commit('M_roles', roles)
          // commit('SET_AVATAR', avatar)
          resolve(data)
        })
        .catch((error: any) => {
          reject(error)
        })
    })
  },
  // user logout
  logout({ dispatch }) {
    return new Promise((resolve, reject) => {
      logoutReq()
        .then(() => {
          dispatch('resetState')
          resolve(null)
        })
        .catch((error: any) => {
          reject(error)
        })
    })
  },
  resetState({ commit, dispatch }) {
    return new Promise((resolve) => {
      commit('M_username', '')
      commit('M_roles', [])
      removeToken() // must remove  token  first
      resetRouter() // reset the router
      commit('permission/M_isGetUserInfo', false, { root: true })

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })
      resolve(null)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
