import { RouterTy } from '~/router';
import { PermissionTy } from '~/store';
export declare function filterAsyncRoutes(routes: RouterTy, roles: Array<string>): RouterTy;
export declare const usePermissionStore: import("pinia").StoreDefinition<"permission", PermissionTy, {}, {
    M_routes(routes: RouterTy): void;
    M_isGetUserInfo(data: boolean): void;
    generateRoutes(roles: Array<string>): Promise<unknown>;
}>;
