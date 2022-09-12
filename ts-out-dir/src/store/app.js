import defaultSettings from '@/settings';
import { defineStore } from 'pinia';
export const useAppStore = defineStore('app', {
    state: () => {
        return {
            sidebar: { opened: true },
            device: 'desktop',
            settings: defaultSettings,
            cachedViews: [],
            cachedViewsDeep: []
        };
    },
    actions: {
        M_settings(data) {
            this.$patch((state) => {
                state.settings = { ...state.settings, ...data };
            });
        },
        M_sidebar_opened(data) {
            this.$patch((state) => {
                state.sidebar.opened = data;
            });
        },
        M_toggleSideBar() {
            this.$patch((state) => {
                state.sidebar.opened = !state.sidebar.opened;
            });
        },
        M_ADD_CACHED_VIEW(view) {
            this.$patch((state) => {
                if (state.cachedViews.includes(view))
                    return;
                state.cachedViews.push(view);
            });
        },
        M_DEL_CACHED_VIEW(view) {
            this.$patch((state) => {
                const index = state.cachedViews.indexOf(view);
                index > -1 && state.cachedViews.splice(index, 1);
            });
        },
        M_ADD_CACHED_VIEW_DEEP(view) {
            this.$patch((state) => {
                if (state.cachedViewsDeep.includes(view))
                    return;
                state.cachedViewsDeep.push(view);
            });
        },
        M_DEL_CACHED_VIEW_DEEP(view) {
            this.$patch((state) => {
                const index = state.cachedViewsDeep.indexOf(view);
                index > -1 && state.cachedViewsDeep.splice(index, 1);
            });
        },
        A_sidebar_opened(data) {
            this.M_sidebar_opened(data);
        }
    }
});
//# sourceMappingURL=app.js.map