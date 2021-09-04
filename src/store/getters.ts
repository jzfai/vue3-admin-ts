interface getter_ty {
  app: app_type
  permission: permission_type
}

const getters = {
  device: (state: getter_ty) => state.app.device,
  cachedViews: (state: getter_ty) => state.app.cachedViews
}
export default getters
