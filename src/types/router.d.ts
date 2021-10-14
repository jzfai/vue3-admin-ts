/*page common ts*/
import { RouteRecordRaw } from 'vue-router'

/*此处扩展的类型*/
interface RouteItemTy {
  hidden?: boolean
  alwaysShow?: boolean
  code?: number
  name?: string
  fullPath?: string
  path?: string
  meta?: {
    title: string
    icon?: string
    affix?: boolean
    activeMenu?: string
    breadcrumb?: boolean
    roles?: Array<string>
    code?: number
  }
  children?: RouterTy
  redirect?: string
}

type RouterRowTy = RouteRecordRaw & RouteItemTy
type RouterTy = Array<RouterRowTy>
