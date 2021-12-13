//https://blog.csdn.net/weixin_34865745/article/details/113992767
import request from '@/utils/axiosReq'
import setting from '@/settings'
import bus from '@/utils/bus'
import pack from '../../package.json'
import { ObjTy } from '@/types/common'
const errorLogReq = (errLog: string) => {
  request({
    url: '/ty-user/errorCollection/insert',
    data: {
      pageUrl: window.location.href,
      errorLog: errLog,
      browserType: navigator.userAgent,
      version: pack.version
    },
    method: 'post',
    bfLoading: false,
    isAlertErrorMsg: true
  }).then(() => {
    bus.emit('reloadErrorPage', {})
  })
}

export default function (app: ObjTy) {
  //type judge
  // base type  using 'type of'
  // Reference type using 'instance of'
  // recommend to reading https://www.jianshu.com/p/ddc7f189d130
  const checkNeed = () => {
    const env = import.meta.env.VITE_APP_ENV
    const { errorLog }: ObjTy = setting
    if (typeof errorLog === 'string') {
      return env === errorLog
    }
    if (errorLog instanceof Array) {
      return errorLog.includes(env)
    }
    return false
  }
  if (checkNeed()) {
    //error log white
    const whiteList: Array<string> = ['cancel']
    //add img load error log listen
    document.addEventListener(
      'error',
      (err: any) => {
        const errLog: any = `${JSON.stringify(err.target.outerHTML)}`
        errorLogReq(errLog)
      },
      true
    )
    app.config.errorHandler = (err: any) => {
      if (whiteList.includes(err)) return
      const errLog = `${err.message}---${err.stack.substr(0, 300)}`
      errorLogReq(errLog)
    }
  }
}
