import { RouteItemTy } from '~/router';
export declare const useTagsViewStore: import("pinia").StoreDefinition<"tagsView", {
    visitedViews: any[];
}, {}, {
    ADD_VISITED_VIEW(view: any): void;
    DEL_VISITED_VIEW(view: any): void;
    DEL_OTHERS_VISITED_VIEWS(view: any): void;
    DEL_ALL_VISITED_VIEWS(): void;
    addView(view: any): void;
    delView(view: any): Promise<unknown>;
    delVisitedView(view: any): Promise<unknown>;
    delOthersViews(view: RouteItemTy): Promise<unknown>;
    delOthersVisitedViews(view: RouteItemTy): Promise<unknown>;
    delAllViews(): Promise<unknown>;
    delAllVisitedViews(): Promise<unknown>;
}>;
