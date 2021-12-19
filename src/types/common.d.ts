/*类型命名建议以Ty结尾*/
/*
*
枚举 类，接口 都是大驼峰 WangMeng
方法，变量，常量 小驼峰 wangMeng
* */
/*通用对象*/
interface ObjTy {
  [propName: string]: any
}
/*axiosReq请求配置*/
import { AxiosRequestConfig } from 'axios'
import { type } from 'os'
interface AxiosReqTy extends AxiosRequestConfig {
  url?: string
  method?: string
  data?: ObjTy
  isParams?: boolean
  bfLoading?: boolean
  afHLoading?: boolean
  isUploadFile?: boolean
  isDownLoadFile?: boolean
  isAlertErrorMsg?: boolean
  baseURL?: string
  timeout?: number
}

export type detailDialogMixin = boolean

interface AxiosConfigTy {
  url?: string
  method?: string
  data?: ObjTy
  isParams?: boolean
  bfLoading?: boolean
  afHLoading?: boolean
  isUploadFile?: boolean
  isDownLoadFile?: boolean
  isAlertErrorMsg?: boolean
  baseURL?: string
  timeout?: number
}

