import axios from 'axios';
import { ElMessage } from 'element-plus';
const service = axios.create({
    baseURL: '',
    timeout: 8000
});
service.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
});
service.interceptors.response.use((response) => {
    const res = response.data;
    if (res.code !== 20000) {
        ElMessage({
            message: res.ElMessage || 'Error',
            type: 'error',
            duration: 5 * 1000
        });
        return Promise.reject(new Error(res.ElMessage || 'Error'));
    }
    else {
        return res;
    }
}, (error) => {
    console.log('err' + error);
    ElMessage({
        message: error.ElMessage,
        type: 'error',
        duration: 5 * 1000
    });
    return Promise.reject(error);
});
export default service;
//# sourceMappingURL=mockAxiosReq.js.map