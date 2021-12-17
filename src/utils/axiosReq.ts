import store from '@/store'
import axios from 'axios'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { getToken, setToken } from '@/utils/auth'
import { AxiosConfigTy, AxiosReqTy, ObjTy } from '@/types/common'
let reqConfig: any
let loadingE: any

const service: any = axios.create()
// 请求拦截
service.interceptors.request.use(
  (request: AxiosReqTy) => {
    // token setting
    request.headers['AUTHORIZE_TOKEN'] = getToken()
    /* download file*/
    if (request.isDownLoadFile) {
      request.responseType = 'blob'
    }
    /* upload file*/
    if (request.isUploadFile) {
      request.headers['Content-Type'] = 'multipart/form-data'
    }
    reqConfig = request
    if (request.bfLoading) {
      loadingE = ElLoading.service({
        lock: true,
        text: '数据载入中',
        // spinner: 'el-icon-ElLoading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
    }
    /*
     *params会拼接到url上
     * */
    if (request.isParams) {
      request.params = request.data
      request.data = {}
    }
    return request
  },
  (err: any) => {
    Promise.reject(err)
  }
)
// 响应拦截
service.interceptors.response.use(
  (res: any) => {
    console.log('res', res)
    if (reqConfig.afHLoading && loadingE) {
      loadingE.close()
    }
    // 如果是下载文件直接返回
    if (reqConfig.isDownLoadFile) {
      return res.data
    }
    const { flag, msg, isNeedUpdateToken, updateToken, code } = res.data
    //更新token保持登录状态
    if (isNeedUpdateToken) {
      setToken(updateToken)
    }
    const successCode = '0,200,20000'
    if (successCode.indexOf(code)) {
      return res.data
    } else {
      if (code === 403) {
        ElMessageBox.confirm('请重新登录', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
            //direct return
            return Promise.reject(res.data)
          })
        })
      }
      if (reqConfig.isAlertErrorMsg) {
        ElMessage({
          message: msg,
          type: 'error',
          duration: 2 * 1000
        })
      }
      //返回错误信息
      //如果未catch 走unhandledrejection进行收集
      return Promise.reject(res.data)
    }
  },
  (err: any) => {
    /*http错误处理，处理跨域，404，401，500*/
    if (loadingE) loadingE.close()
    ElMessage({
      message: err,
      type: 'error',
      duration: 2 * 1000
    })
    //如果是跨域
    //Network Error,cross origin
    const errObj: ObjTy = {
      msg: err.toString(),
      reqUrl: reqConfig.baseURL + reqConfig.url,
      params: reqConfig.isParams ? reqConfig.params : reqConfig.data
    }
    return Promise.reject(JSON.stringify(errObj))
  }
)

export default function khReqMethod({
  url,
  data,
  method,
  isParams,
  bfLoading,
  afHLoading,
  isUploadFile,
  isDownLoadFile,
  baseURL,
  timeout,
  isAlertErrorMsg = true
}: AxiosConfigTy): any {
  return service({
    url: url,
    method: method ?? 'get',
    data: data ?? {},
    isParams: isParams ?? false,
    bfLoading: bfLoading ?? false,
    afHLoading: afHLoading ?? true,
    isUploadFile: isUploadFile ?? false,
    isDownLoadFile: isDownLoadFile ?? false,
    isAlertErrorMsg: isAlertErrorMsg,
    baseURL: baseURL ?? import.meta.env.VITE_APP_BASE_URL,
    timeout: timeout ?? 15000
  })
}
