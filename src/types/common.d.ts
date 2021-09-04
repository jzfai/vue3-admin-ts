interface ImportMeta {
  env: any
  url: string
  globEager: any
}
/*通用对象*/
interface Obj_type {
  [propName: string]: any
}
/*axiosReq请求配置*/
import { AxiosRequestConfig } from 'axios'
interface axios_req_ty extends AxiosRequestConfig {
  url?: string
  method?: string
  data?: Obj_type
  isParams?: boolean
  bfLoading?: boolean
  afHLoading?: boolean
  isUploadFile?: boolean
  isDownLoadFile?: boolean
  isAlertErrorMsg?: boolean
  baseURL?: string
  timeout?: number
}
interface axios_c_ty {
  url?: string
  method?: string
  data?: Obj_type
  isParams?: boolean
  bfLoading?: boolean
  afHLoading?: boolean
  isUploadFile?: boolean
  isDownLoadFile?: boolean
  isAlertErrorMsg?: boolean
  baseURL?: string
  timeout?: number
}
