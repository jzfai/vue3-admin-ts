import { getToken } from '@/utils/auth';
import momentMini from 'moment-mini';
export const useCommonExample = () => {
    const state = reactive({
        totalPage: 0,
        searchForm: {},
        fileList: [],
        chooseFileName: '',
        commonValue: '',
        modalShowTitle: '',
        VITE_APP_IMAGE_URL_PRE: '',
        VITE_APP_BASE_URL: '',
        VITE_APP_BASE_WS_URL: '',
        accessToken: '',
        userBaseInfo: {},
        startEndArr: [],
        todayTime: '',
        currentTime: '',
        todayTimeLast: '',
        yesterdayTime: '',
        beforeThreeDateTime: ''
    });
    state.VITE_APP_IMAGE_URL_PRE = import.meta.env.VITE_APP_BASE_URL;
    state.VITE_APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL;
    state.accessToken = getToken();
    state.todayTime = momentMini().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    state.currentTime = momentMini(new Date()).format('YYYY-MM-DD HH:mm:ss');
    state.todayTimeLast = momentMini().endOf('day').format('YYYY-MM-DD HH:mm:ss');
    state.beforeThreeDateTime = momentMini().add(-3, 'days').format('YYYY-MM-DD HH:mm:ss');
    state.yesterdayTime = momentMini().add(-1, 'days').format('YYYY-MM-DD HH:mm:ss');
    const sleep = (time) => {
        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                clearTimeout(timer);
                resolve(null);
            }, time);
        });
    };
    return {
        sleep,
        ...toRefs(state)
    };
};
export const useCommon = useCommonExample;
export default useCommonExample;
//# sourceMappingURL=useCommon.js.map