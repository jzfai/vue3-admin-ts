import request from '@/utils/axiosReq';
import setting from '@/settings';
import bus from '@/utils/bus';
import pack from '../../package.json';
import { jsErrorCollection } from 'js-error-collection';
const errorLogReq = (errLog) => {
    request({
        url: '/integration-front/errorCollection/insert',
        data: {
            pageUrl: window.location.href,
            errorLog: errLog,
            browserType: navigator.userAgent,
            version: pack.version
        },
        method: 'post',
        bfLoading: false,
        isAlertErrorMsg: true
    }).then(() => {
        bus.emit('reloadErrorPage', {});
    });
};
export default function () {
    const checkNeed = () => {
        const env = import.meta.env.VITE_APP_ENV;
        const { errorLog } = setting;
        if (typeof errorLog === 'string') {
            return env === errorLog;
        }
        if (errorLog instanceof Array) {
            return errorLog.includes(env);
        }
        return false;
    };
    if (checkNeed()) {
        jsErrorCollection({ runtimeError: true, rejectError: true, consoleError: true }, (errLog) => {
            errorLogReq(errLog);
        });
    }
}
//# sourceMappingURL=useErrorLog.js.map