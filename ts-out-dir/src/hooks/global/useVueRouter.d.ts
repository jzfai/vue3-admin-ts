import { ObjTy } from '~/common';
declare const useVueRouterExample: () => {
    routerPush: (name: string, params: ObjTy) => void;
    routerReplace: (name: string, params: ObjTy) => void;
    routerBack: () => void;
    getQueryParam: () => any;
};
export declare const useVueRouter: () => {
    routerPush: (name: string, params: ObjTy) => void;
    routerReplace: (name: string, params: ObjTy) => void;
    routerBack: () => void;
    getQueryParam: () => any;
};
export default useVueRouterExample;
