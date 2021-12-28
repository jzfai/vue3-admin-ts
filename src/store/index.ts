import { createStore } from 'vuex'
import getters from './getters'
import { ObjTy } from '~/common'
//auto import (perfect!!!)
const modulesFiles = import.meta.globEager('./modules/*.ts')
const modules: ObjTy = {}
for (const path in modulesFiles) {
  const moduleName = path.replace(/(.*\/)*([^.]+).*/gi, '$2')
  modules[moduleName] = modulesFiles[path].default
}
export default createStore({
  modules,
  getters
})
