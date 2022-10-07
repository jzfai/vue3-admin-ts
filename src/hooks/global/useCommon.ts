import { getToken } from '@/utils/auth'
import momentMini from 'moment-mini'
import { ObjTy } from '~/common'

type stateTy = {
  totalPage: number
  searchForm: ObjTy
  /* 文件上传相关*/
  fileList: Array<any>
  chooseFileName: string
  /* 多环境配置及token信息*/
  commonValue: string
  modalShowTitle: string
  VITE_APP_IMAGE_URL_PRE: string // 图片前缀地址
  VITE_APP_BASE_URL: string // 请求的url地址
  VITE_APP_BASE_WS_URL: string // 请求的url地址
  accessToken: string // 请求头的token
  userBaseInfo: ObjTy // 用户信息
  startEndArr: ObjTy // 用户信息
  /* 时间点相关*/
  todayTime: string
  currentTime: string
  todayTimeLast: string
  yesterdayTime: string
  beforeThreeDateTime: string
}

export const useCommonExample = () => {
  const state = reactive<stateTy>({
    totalPage: 0,
    searchForm: {},
    /* 文件上传相关*/
    fileList: [],
    chooseFileName: '',
    /* 多环境配置及token信息*/
    commonValue: '',
    modalShowTitle: '',
    VITE_APP_IMAGE_URL_PRE: '', // 图片前缀地址
    VITE_APP_BASE_URL: '', // 请求的url地址
    VITE_APP_BASE_WS_URL: '', // 请求的url地址
    accessToken: '', // 请求头的token
    userBaseInfo: {}, // 用户信息
    startEndArr: [],
    /* 时间点相关*/
    todayTime: '',
    currentTime: '',
    todayTimeLast: '',
    yesterdayTime: '',
    beforeThreeDateTime: ''
  })
  // 读取.env 多坏境里的数据
  state.VITE_APP_IMAGE_URL_PRE = import.meta.env.VITE_APP_BASE_URL as string
  state.VITE_APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL as string
  // 获取token和个人基本信息
  state.accessToken = getToken() as string
  /* 获取时间点*/
  state.todayTime = momentMini().startOf('day').format('YYYY-MM-DD HH:mm:ss')
  state.currentTime = momentMini(new Date()).format('YYYY-MM-DD HH:mm:ss')
  state.todayTimeLast = momentMini().endOf('day').format('YYYY-MM-DD HH:mm:ss')
  state.beforeThreeDateTime = momentMini().add(-3, 'days').format('YYYY-MM-DD HH:mm:ss')
  state.yesterdayTime = momentMini().add(-1, 'days').format('YYYY-MM-DD HH:mm:ss')

  //生成唯一的uuid
  const guid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  const sleep = (time: number): Promise<null> => {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        clearTimeout(timer)
        resolve(null)
      }, time)
    })
  }

  const downLoadTemp = (res) => {
    //得到主键key
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', decodeURI(res.headers?.exportfilename))
    document.body.appendChild(link)
    link.click()
  }
  return {
    downLoadTemp,
    guid,
    sleep,
    ...toRefs(state)
  }
}

export const useCommon = useCommonExample

export default useCommonExample
