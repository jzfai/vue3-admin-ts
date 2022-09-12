import { defineStore } from 'pinia';
import setting from '@/settings';
export const useTagsViewStore = defineStore('tagsView', {
    state: () => {
        return {
            visitedViews: []
        };
    },
    actions: {
        ADD_VISITED_VIEW(view) {
            this.$patch((state) => {
                if (state.visitedViews.some((v) => v.path === view.path))
                    return;
                if (state.visitedViews.length >= setting.tagsViewNum) {
                    state.visitedViews.pop();
                    state.visitedViews.push(Object.assign({}, view, {
                        title: view.meta.title || 'no-name'
                    }));
                }
                else {
                    state.visitedViews.push(Object.assign({}, view, {
                        title: view.meta.title || 'no-name'
                    }));
                }
            });
        },
        DEL_VISITED_VIEW(view) {
            this.$patch((state) => {
                for (const [i, v] of state.visitedViews.entries()) {
                    if (v.path === view.path) {
                        state.visitedViews.splice(i, 1);
                        break;
                    }
                }
            });
        },
        DEL_OTHERS_VISITED_VIEWS(view) {
            this.$patch((state) => {
                state.visitedViews = state.visitedViews.filter((v) => {
                    return v.meta.affix || v.path === view.path;
                });
            });
        },
        DEL_ALL_VISITED_VIEWS() {
            this.$patch((state) => {
                state.visitedViews = state.visitedViews.filter((tag) => tag.meta?.affix);
            });
        },
        addView(view) {
            this.ADD_VISITED_VIEW(view);
        },
        delView(view) {
            return new Promise((resolve) => {
                this.delVisitedView(view);
                this.$patch((state) => {
                    resolve({
                        visitedViews: [...state.visitedViews]
                    });
                });
            });
        },
        delVisitedView(view) {
            return new Promise((resolve) => {
                this.DEL_VISITED_VIEW(view);
                this.$patch((state) => {
                    resolve([...state.visitedViews]);
                });
            });
        },
        delOthersViews(view) {
            return new Promise((resolve) => {
                this.delOthersVisitedViews(view);
                this.$patch((state) => {
                    resolve({
                        visitedViews: [...state.visitedViews]
                    });
                });
            });
        },
        delOthersVisitedViews(view) {
            return new Promise((resolve) => {
                this.DEL_OTHERS_VISITED_VIEWS(view);
                this.$patch((state) => {
                    resolve([...state.visitedViews]);
                });
            });
        },
        delAllViews() {
            return new Promise((resolve) => {
                this.delAllVisitedViews();
                this.$patch((state) => {
                    resolve({
                        visitedViews: [...state.visitedViews]
                    });
                });
            });
        },
        delAllVisitedViews() {
            return new Promise((resolve) => {
                this.DEL_ALL_VISITED_VIEWS();
                this.$patch((state) => {
                    resolve([...state.visitedViews]);
                });
            });
        }
    }
});
//# sourceMappingURL=tagsView.js.map