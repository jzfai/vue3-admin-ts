import { SettingTy } from '~/common';
export declare const useAppStore: import("pinia").StoreDefinition<"app", {
    sidebar: {
        opened: boolean;
    };
    device: string;
    settings: SettingTy;
    cachedViews: string[];
    cachedViewsDeep: string[];
}, {}, {
    M_settings(data: any): void;
    M_sidebar_opened(data: boolean): void;
    M_toggleSideBar(): void;
    M_ADD_CACHED_VIEW(view: any): void;
    M_DEL_CACHED_VIEW(view: any): void;
    M_ADD_CACHED_VIEW_DEEP(view: any): void;
    M_DEL_CACHED_VIEW_DEEP(view: any): void;
    A_sidebar_opened(data: boolean): void;
}>;
