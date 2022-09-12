import router, { asyncRoutes } from '@/router';
import settings from './settings';
import { getToken, setToken } from '@/utils/auth';
import NProgress from 'nprogress';
NProgress.configure({ showSpinner: false });
import 'nprogress/nprogress.css';
import getPageTitle from '@/utils/getPageTitle';
import { useUserStore } from '@/store/user';
import { usePermissionStore } from '@/store/permission';
const whiteList = ['/login', '/404', '/401'];
router.beforeEach(async (to, from, next) => {
    if (settings.isNeedNprogress)
        NProgress.start();
    document.title = getPageTitle(to.meta.title);
    if (!settings.isNeedLogin)
        setToken(settings.tmpToken);
    const hasToken = getToken();
    const userStore = useUserStore();
    const permissionStore = usePermissionStore();
    if (hasToken) {
        if (to.path === '/login') {
            next({ path: '/' });
        }
        else {
            const isGetUserInfo = permissionStore.isGetUserInfo;
            if (isGetUserInfo) {
                next();
            }
            else {
                try {
                    let accessRoutes = [];
                    if (settings.isNeedLogin) {
                        const { roles } = await userStore.getInfo();
                        accessRoutes = await permissionStore.generateRoutes(roles);
                    }
                    else {
                        accessRoutes = asyncRoutes;
                    }
                    permissionStore.M_routes(accessRoutes);
                    accessRoutes.forEach((route) => {
                        router.addRoute(route);
                    });
                    permissionStore.M_isGetUserInfo(true);
                    next({ ...to, replace: true });
                }
                catch (err) {
                    await userStore.resetState();
                    next(`/login?redirect=${to.path}`);
                    if (settings.isNeedNprogress)
                        NProgress.done();
                }
            }
        }
    }
    else {
        if (whiteList.indexOf(to.path) !== -1) {
            next();
        }
        else {
            next(`/login?redirect=${to.path}`);
            if (settings.isNeedNprogress)
                NProgress.done();
        }
    }
});
router.afterEach(() => {
    if (settings.isNeedNprogress)
        NProgress.done();
});
//# sourceMappingURL=permission.js.map