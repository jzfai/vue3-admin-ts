/*page common ts*/
import { RouteRecordRaw } from 'vue-router'

/*此处扩展的类型*/
interface rowItem {
  hidden?: boolean
  alwaysShow?: boolean
  code?: number
}
type router_type = Array<RouteRecordRaw & rowItem>

interface ImportMeta {
  globEager: any
}
