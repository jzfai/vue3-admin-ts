import router from '@/router'
import { ObjTy } from '~/common'
const useVueRouterExample = function () {
  const route: any = router.currentRoute
  const getQueryParam = () => {
    if (route.value?.query.params) {
      return JSON.parse(route.value.query.params)
    }
  }
  // vue router
  const routerPush = (name: string, params: ObjTy) => {
    let data = {}
    if (params) {
      data = {
        params: JSON.stringify(params)
      }
    } else {
      data = {}
    }
    router.push({
      name: name,
      query: data
    })
  }
  const routerReplace = (name: string, params: ObjTy) => {
    let data = {}
    if (params) {
      data = {
        params: JSON.stringify(params)
      }
    } else {
      data = {}
    }
    router.replace({
      name: name,
      query: data
    })
  }
  const routerBack = () => {
    router.go(-1)
  }
  return {
    routerPush,
    routerReplace,
    routerBack,
    getQueryParam
  }
}
// hooksFunc() not direct use the  mounted , but hooksFunc can use
// export default hooksFunc()
export const useVueRouter = useVueRouterExample
export default useVueRouterExample
