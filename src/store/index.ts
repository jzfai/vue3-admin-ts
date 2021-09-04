import { Obj_type } from '@/types/common'
import { createStore } from 'vuex'
import getters from './getters'

//简单的方式
const modulesFiles = import.meta.globEager('./modules/*.ts')
const modules: Obj_type = {}
//复杂的方式
// const modulesFiles = import.meta.globEager('./modules/*.js')
// console.log(Object.keys(modulesFiles));
// const modules = Object.keys(modulesFiles).reduce((modules, modulePath) => {
//   // const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
//   const moduleName = modulePath.replace(/(.*\/)*([^.]+).*/gi, '$2')
//   const value = modulesFiles[modulePath]
//   modules[moduleName] = value.default
//   return modules
// }, {})
// console.log(modules);
for (const path in modulesFiles) {
  const moduleName: string = path.replace(/(.*\/)*([^.]+).*/gi, '$2')
  console.log('moduleName', moduleName)
  modules[moduleName] = modulesFiles[path].default
}
export default createStore<state_type>({
  modules,
  getters
})
