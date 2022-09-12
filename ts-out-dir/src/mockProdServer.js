import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';
const modulesFiles = import.meta.globEager('../mock/*.ts');
let modules = [];
for (const path in modulesFiles) {
    modules = modules.concat(modulesFiles[path].default);
}
export function setupProdMockServer() {
    createProdMockServer([...modules]);
}
//# sourceMappingURL=mockProdServer.js.map