//https://blog.csdn.net/weixin_34865745/article/details/113992767
import request from '@/utils/axiosReq'
import setting from '@/settings'
import bus from '@/utils/bus'
import pack from '../../package.json'
import { ObjTy } from '~/common'
import { jsErrorCollection } from 'js-errorlog-collection'
const errorLogReq = (errLog: string) => {
  request({
    url: '/integration-front/errorCollection/insert',
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

export default function () {
  /*
   * type judge
   * base type  using 'type of'
   * Reference type using 'instance of'
   * recommend to reading https://www.jianshu.com/p/ddc7f189d130
   * */
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
    jsErrorCollection({ runtimeError: true, rejectError: true, consoleError: true }, (errLog) => {
      errorLogReq(errLog)
    })
  }
}
