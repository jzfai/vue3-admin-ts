import request from 'axios'
import { ObjTy } from '@/types/common'

export function getList(params: ObjTy) {
  return request({
    url: '/vue3-admin-template/table/list',
    method: 'get',
    data: params
  })
}
