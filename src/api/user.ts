import request from '@/utils/axiosReq'
import { ObjTy } from '~/common'

export function loginReq(data: ObjTy) {
  return request({
    url: '/basis-func/user/loginValid',
    data,
    method: 'post',
    bfLoading: false,
    isParams: true,
    isAlertErrorMsg: false
  })
}

export function getInfoReq(plateFormId) {
  return request({
    url: '/basis-func/user/getUserInfo',
    bfLoading: false,
    data: { plateFormId },
    method: 'post',
    isParams: true,
    isAlertErrorMsg: false
  })
}

export function logoutReq() {
  return request({
    url: '/basis-func/user/loginOut',
    method: 'post'
  })
}
