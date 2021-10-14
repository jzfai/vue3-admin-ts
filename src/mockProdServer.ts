import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'

//using import.meta.glob auto import  prefer !!!
const modulesFiles = import.meta.globEager('../mock/*.ts')
const modules: Array<any> = []
for (const path in modulesFiles) {
  modules.push(...modulesFiles[path].default)
}

export function setupProdMockServer() {
  createProdMockServer(modules)
}
