/*vuex ts*/
import { RouterTy } from '@/types/router'

interface statTy {
  app: AppTy
  permission: PermissionTy
  user: UserTy
}

interface AppTy {
  sidebar: {
    opened: boolean
    //opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    // withoutAnimation: false
  }
  device: 'desktop'
  cachedViews: Array<string>
}
interface PermissionTy {
  isSettingPermission: boolean //是否已经设置了权限
  routes: RouterTy //将过滤后的异步路由和静态路由集合
  addRoutes: RouterTy //过滤后的异步路由
}

interface UserTy {
  username: string
  avatar: string
}
