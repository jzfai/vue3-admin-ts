import request from '@/utils/axiosReq'
import { ObjTy } from '~/common'

export function loginReq(data: ObjTy) {
  return request({
    url: '/integration-front/user/loginValid',
    data,
    method: 'post',
    bfLoading: false,
    isParams: true,
    isAlertErrorMsg: false
  })
}

export function getInfoReq() {
  return request({
    url: '/integration-front/user/getUserInfo',
    bfLoading: false,
    method: 'post',
    isAlertErrorMsg: false
  })
}

export function logoutReq() {
  return request({
    url: '/integration-front/user/loginOut',
    method: 'post'
  })
}
