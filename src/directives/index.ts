import permission from './permission'
import { ObjTy } from '~/common'
export default function (app: ObjTy) {
  app.directive('permission', permission)
}
