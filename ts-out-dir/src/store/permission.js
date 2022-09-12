import { defineStore } from 'pinia';
import { asyncRoutes, constantRoutes } from '@/router';
import settings from '@/settings';
function hasCodePermission(codeArr, routeItem) {
    if (routeItem.meta && routeItem.meta.code) {
        return codeArr.includes(routeItem.meta.code) || routeItem.hidden;
    }
    else {
        return true;
    }
}
function filterRouterByCodeArr(codeArr, asyncRoutes) {
    return new Promise((resolve) => {
        const filterRouter = [];
        asyncRoutes.forEach(async (routeItem) => {
            if (hasCodePermission(codeArr, routeItem)) {
                if (routeItem.children) {
                    routeItem.children = await filterRouterByCodeArr(codeArr, routeItem.children);
                }
                filterRouter.push(routeItem);
            }
        });
        resolve(filterRouter);
    });
}
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some((role) => route.meta?.roles?.includes(role));
    }
    else {
        return true;
    }
}
export function filterAsyncRoutes(routes, roles) {
    const res = [];
    routes.forEach((route) => {
        const tmp = { ...route };
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles);
            }
            res.push(tmp);
        }
    });
    return res;
}
export const usePermissionStore = defineStore('permission', {
    state: () => {
        return {
            isGetUserInfo: false,
            routes: [],
            addRoutes: []
        };
    },
    actions: {
        M_routes(routes) {
            this.$patch((state) => {
                state.addRoutes = routes;
                state.routes = constantRoutes.concat(routes);
            });
        },
        M_isGetUserInfo(data) {
            this.$patch((state) => {
                state.isGetUserInfo = data;
            });
        },
        generateRoutes(roles) {
            return new Promise(async (resolve) => {
                let accessedRoutes;
                if (settings.permissionMode === 'roles') {
                    if (roles.includes('admin')) {
                        accessedRoutes = asyncRoutes || [];
                    }
                    else {
                        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
                    }
                }
                else {
                    let codeArr = localStorage.getItem('codeArr');
                    if (codeArr) {
                        codeArr = JSON.parse(codeArr);
                    }
                    else {
                        localStorage.setItem('codeArr', JSON.stringify([1]));
                        codeArr = localStorage.getItem('codeArr');
                    }
                    accessedRoutes = await filterRouterByCodeArr(codeArr, asyncRoutes);
                }
                resolve(accessedRoutes);
            });
        }
    }
});
//# sourceMappingURL=permission.js.map