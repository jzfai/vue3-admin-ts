//https://blog.csdn.net/weixin_34865745/article/details/113992767
import request from '@/utils/axiosReq'
import bus from '@/utils/bus'
import setting from '@/settings'
import { ObjTy } from '@/types/common'

export default function (app: ObjTy) {
  //type judge
  // base type  using type of
  // Reference type using instance of
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
    app.config.errorHandler = (err: ObjTy) => {
      request({
        url: '/ty-user/errorCollection/insert',
        data: { pageUrl: window.location.href, errorLog: `${err.message}---${err.stack}` },
        method: 'post',
        bfLoading: false,
        isAlertErrorMsg: true
      }).then(() => {
        bus.emit('reloadErrorPage')
      })
    }
  }
}
