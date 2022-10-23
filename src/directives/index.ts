import permission from './permission'
import buttonCodes from './button-codes'
import { ObjTy } from '~/common'
export default function (app: ObjTy) {
  app.directive('permission', permission)
  app.directive('button-codes', buttonCodes)
}
