import { loginReq, logoutReq, getInfoReq } from '@/api/user'
import { setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'
import { ObjTy } from '@/types/common'

//token: getToken(),

const getDefaultState = () => {
  return {
    //token: getToken(),
    username: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  SET_NAME: (state: UserTy, username: string) => {
    state.username = username
  },
  SET_AVATAR: (state: UserTy, avatar: string) => {
    state.avatar = avatar
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
          const { username } = data
          commit('SET_NAME', username)
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
