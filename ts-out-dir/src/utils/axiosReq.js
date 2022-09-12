import axios from 'axios';
import router from '@/router';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import { getToken, setToken } from '@/utils/auth';
import { useUserStore } from '@/store/user';
let reqConfig;
let loadingE;
const service = axios.create();
service.interceptors.request.use((request) => {
    request.headers['AUTHORIZE_TOKEN'] = getToken();
    if (request.isDownLoadFile) {
        request.responseType = 'blob';
    }
    if (request.isUploadFile) {
        request.headers['Content-Type'] = 'multipart/form-data';
    }
    reqConfig = request;
    if (request.bfLoading) {
        loadingE = ElLoading.service({
            lock: true,
            text: '数据载入中',
            background: 'rgba(0, 0, 0, 0.1)'
        });
    }
    if (request.isParams) {
        request.params = request.data;
        request.data = {};
    }
    return request;
}, (err) => {
    Promise.reject(err);
});
service.interceptors.response.use((res) => {
    if (reqConfig.afHLoading && loadingE) {
        loadingE.close();
    }
    if (reqConfig.isDownLoadFile) {
        return res;
    }
    const { flag, msg, isNeedUpdateToken, updateToken, code } = res.data;
    if (isNeedUpdateToken) {
        setToken(updateToken);
    }
    const successCode = '0,200,20000';
    if (successCode.includes(code)) {
        return res.data;
    }
    else {
        if (code === 403) {
            ElMessageBox.confirm('请重新登录', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const userStore = useUserStore();
                userStore.resetState().then(() => {
                    router.push({ path: '/login' });
                });
            });
        }
        if (reqConfig.isAlertErrorMsg) {
            ElMessage({
                message: msg,
                type: 'error',
                duration: 2 * 1000
            });
        }
        return Promise.reject(res.data);
    }
}, (err) => {
    if (loadingE)
        loadingE.close();
    ElMessage({
        message: err,
        type: 'error',
        duration: 2 * 1000
    });
    const errObj = {
        msg: err.toString(),
        reqUrl: reqConfig.baseURL + reqConfig.url,
        params: reqConfig.isParams ? reqConfig.params : reqConfig.data
    };
    return Promise.reject(JSON.stringify(errObj));
});
export function axiosReq({ url, data, method, isParams, bfLoading, afHLoading, isUploadFile, isDownLoadFile, baseURL, timeout, isAlertErrorMsg = true }) {
    return service({
        url: url,
        method: method ?? 'get',
        data: data ?? {},
        isParams: isParams ?? false,
        bfLoading: bfLoading ?? false,
        afHLoading: afHLoading ?? true,
        isUploadFile: isUploadFile ?? false,
        isDownLoadFile: isDownLoadFile ?? false,
        isAlertErrorMsg: isAlertErrorMsg,
        baseURL: baseURL ?? import.meta.env.VITE_APP_BASE_URL,
        timeout: timeout ?? 15000
    });
}
export default axiosReq;
//# sourceMappingURL=axiosReq.js.map