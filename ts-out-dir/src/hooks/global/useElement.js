import { ElLoading, ElNotification, ElMessage, ElMessageBox } from 'element-plus';
const useElementExample = () => {
    const passwordValid = (rule, value, callback) => {
        if (!/^(?![^a-zA-Z]+$)(?!\D+$)/.test(value)) {
            callback(new Error('6-18位字母、数字'));
        }
        else {
            callback();
        }
    };
    const upZeroInt = (rule, value, callback) => {
        if (!/^\+?[1-9]\d*$/.test(value)) {
            callback(new Error('大于0的整数'));
        }
        else {
            callback();
        }
    };
    const upZeroIntCanNull = (rule, value, callback) => {
        if (!value) {
            callback();
        }
        else {
            if (!/^\+?[1-9]\d*$/.test(value)) {
                callback(new Error('大于0的整数'));
            }
            else {
                callback();
            }
        }
    };
    const validatePass = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请输入密码'));
        }
        else {
            callback();
        }
    };
    const state = reactive({
        tableData: [],
        rowDeleteIdArr: [],
        loadingId: null,
        formModel: {},
        subForm: {},
        searchForm: {},
        formRules: {
            isNotNull: [{ required: true, message: '该字段不能为空', trigger: 'blur' }],
            isNotNullSecond: [{ required: true, message: '不能为空', trigger: 'blur' }],
            mLength8: [
                { required: true, message: '该字段不能为空', trigger: 'blur' },
                { max: 8, message: '最长为8个字符', trigger: 'blur' }
            ],
            minLength7: [
                { required: true, message: '该字段不能为空', trigger: 'blur' },
                { min: 7, message: '最小7个字符', trigger: 'blur' }
            ],
            length17: [
                { required: true, message: '该字段不能为空', trigger: 'blur' },
                { min: 17, max: 17, message: '长度为17个字符', trigger: 'blur' }
            ],
            desc: [{ validator: validatePass, trigger: 'blur' }],
            upZeroInt: [{ validator: upZeroInt, trigger: 'blur' }],
            upZeroIntCanNull: [{ validator: upZeroIntCanNull, trigger: 'blur' }],
            passwordValid: [{ validator: passwordValid, trigger: 'blur' }]
        },
        datePickerOptions: {
            disabledDate: (time) => {
                return time.getTime() < Date.now() - 86400000;
            }
        },
        startEndArr: [],
        startEndArrSub: [],
        dialogTitle: '添加',
        detailDialog: false,
        isDialogEdit: false,
        dialogVisible: false,
        tableLoading: false,
        cascaderKey: 1,
        SetKesDept: {
            value: 'id',
            expandTrigger: 'hover',
            label: 'label',
            children: 'children'
        },
        SetKesDeptNoStrictly: {
            value: 'id',
            expandTrigger: 'hover',
            label: 'label',
            children: 'children',
            checkStrictly: true
        },
        cascaderOptionsOne: [],
        cascaderOptions: [],
        treeData: [],
        defaultProps: {
            children: 'children',
            label: 'label'
        }
    });
    const cascaderKey = ref(null);
    const casHandleChange = () => {
        cascaderKey.value += cascaderKey.value;
    };
    const elMessage = (message, type) => {
        ElMessage({
            showClose: true,
            message: message || '成功',
            type: type || 'success',
            center: false
        });
    };
    let loadingId = null;
    const elLoading = () => {
        loadingId = ElLoading.service({
            lock: true,
            text: '数据载入中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.1)'
        });
    };
    const elNotify = (message, type, title, duration) => {
        ElNotification({
            title: title || '提示',
            type: type || 'success',
            message: message || '请传入提示消息',
            position: 'top-right',
            duration: duration || 2500,
            offset: 40
        });
    };
    const elConfirmNoCancelBtn = (title, message) => {
        return ElMessageBox({
            message: message || '你确定要删除吗',
            title: title || '确认框',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            showCancelButton: false,
            type: 'warning'
        });
    };
    const elConfirm = (title, message) => {
        return ElMessageBox({
            message: message || '你确定要删除吗',
            title: title || '确认框',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        });
    };
    return {
        casHandleChange,
        elMessage,
        elLoading,
        elNotify,
        elConfirmNoCancelBtn,
        elConfirm,
        ...toRefs(state)
    };
};
export const useElement = useElementExample;
export default useElementExample;
//# sourceMappingURL=useElement.js.map