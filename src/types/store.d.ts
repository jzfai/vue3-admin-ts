/*vuex ts*/
interface app_type {
  sidebar: {
    opened: boolean
  }
  device: string
  cachedViews: Array<string>
}

interface permission_type {
  isSettingPermission: boolean
  routes: routerItem
  addRoutes: routerItem
}

interface state_type {
  permission: permission_type
  app: app.ts
}
