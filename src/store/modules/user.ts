import { loginReq, logoutReq, getInfoReq } from '@/api/user'
import { setToken, removeToken } from '@/utils/auth'
import { ObjTy } from '@/types/common'
import { UserTy } from '@/types/store'
//token: getToken(),

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
  logout() {
    return new Promise((resolve, reject) => {
      logoutReq()
        .then(() => {
          removeToken() // must remove  token  first
          // resetRouter()
          resolve(null)
        })
        .catch((error: any) => {
          reject(error)
        })
    })
  },
  // remove token
  resetToken() {
    return new Promise((resolve) => {
      removeToken() // must remove  token  first
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
