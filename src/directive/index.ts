import permission from './permission'
import { ObjTy } from '@/types/common'
export default function (app: ObjTy) {
  app.directive('permission', permission)
}
