import { usePermissionStore } from '@/store/permission'
function checkPermission(el: any, binding: any) {
  const { value } = binding
  const usePermission = usePermissionStore()
  const buttonCodes = usePermission.buttonCodes
  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value
      const hasPermission = buttonCodes.some((code: string) => {
        return permissionRoles.includes(code)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error(`need roles! Like v-permission="['admin','editor']"`)
  }
}

//vue2和vue3中指令对比https://jishuin.proginn.com/p/763bfbd29cb7
export default {
  mounted(el: any, binding: any) {
    checkPermission(el, binding)
  },
  componentUpdated(el: any, binding: any) {
    checkPermission(el, binding)
  }
}
