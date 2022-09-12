declare const useElementExample: () => {
    tableData: import("vue").Ref<never[]>;
    rowDeleteIdArr: import("vue").Ref<never[]>;
    loadingId: import("vue").Ref<null>;
    formModel: import("vue").Ref<{}>;
    subForm: import("vue").Ref<{}>;
    searchForm: import("vue").Ref<{}>;
    formRules: import("vue").Ref<{
        isNotNull: {
            required: boolean;
            message: string;
            trigger: string;
        }[];
        isNotNullSecond: {
            required: boolean;
            message: string;
            trigger: string;
        }[];
        mLength8: ({
            required: boolean;
            message: string;
            trigger: string;
            max?: undefined;
        } | {
            max: number;
            message: string;
            trigger: string;
            required?: undefined;
        })[];
        minLength7: ({
            required: boolean;
            message: string;
            trigger: string;
            min?: undefined;
        } | {
            min: number;
            message: string;
            trigger: string;
            required?: undefined;
        })[];
        length17: ({
            required: boolean;
            message: string;
            trigger: string;
            min?: undefined;
            max?: undefined;
        } | {
            min: number;
            max: number;
            message: string;
            trigger: string;
            required?: undefined;
        })[];
        desc: {
            validator: (rule: any, value: any, callback: any) => void;
            trigger: string;
        }[];
        upZeroInt: {
            validator: (rule: any, value: any, callback: any) => void;
            trigger: string;
        }[];
        upZeroIntCanNull: {
            validator: (rule: any, value: any, callback: any) => void;
            trigger: string;
        }[];
        passwordValid: {
            validator: any;
            trigger: string;
        }[];
    }>;
    datePickerOptions: import("vue").Ref<{
        disabledDate: (time: any) => boolean;
    }>;
    startEndArr: import("vue").Ref<never[]>;
    startEndArrSub: import("vue").Ref<never[]>;
    dialogTitle: import("vue").Ref<string>;
    detailDialog: import("vue").Ref<boolean>;
    isDialogEdit: import("vue").Ref<boolean>;
    dialogVisible: import("vue").Ref<boolean>;
    tableLoading: import("vue").Ref<boolean>;
    cascaderKey: import("vue").Ref<number>;
    SetKesDept: import("vue").Ref<{
        value: string;
        expandTrigger: string;
        label: string;
        children: string;
    }>;
    SetKesDeptNoStrictly: import("vue").Ref<{
        value: string;
        expandTrigger: string;
        label: string;
        children: string;
        checkStrictly: boolean;
    }>;
    cascaderOptionsOne: import("vue").Ref<never[]>;
    cascaderOptions: import("vue").Ref<never[]>;
    treeData: import("vue").Ref<never[]>;
    defaultProps: import("vue").Ref<{
        children: string;
        label: string;
    }>;
    casHandleChange: () => void;
    elMessage: (message?: string, type?: any) => void;
    elLoading: () => void;
    elNotify: (message?: string, type?: any, title?: string, duration?: number) => void;
    elConfirmNoCancelBtn: (title?: string, message?: string) => Promise<import("element-plus").MessageBoxData>;
    elConfirm: (title?: string, message?: string) => Promise<import("element-plus").MessageBoxData>;
};
export declare const useElement: () => {
    tableData: import("vue").Ref<never[]>;
    rowDeleteIdArr: import("vue").Ref<never[]>;
    loadingId: import("vue").Ref<null>;
    formModel: import("vue").Ref<{}>;
    subForm: import("vue").Ref<{}>;
    searchForm: import("vue").Ref<{}>;
    formRules: import("vue").Ref<{
        isNotNull: {
            required: boolean;
            message: string;
            trigger: string;
        }[];
        isNotNullSecond: {
            required: boolean;
            message: string;
            trigger: string;
        }[];
        mLength8: ({
            required: boolean;
            message: string;
            trigger: string;
            max?: undefined;
        } | {
            max: number;
            message: string;
            trigger: string;
            required?: undefined;
        })[];
        minLength7: ({
            required: boolean;
            message: string;
            trigger: string;
            min?: undefined;
        } | {
            min: number;
            message: string;
            trigger: string;
            required?: undefined;
        })[];
        length17: ({
            required: boolean;
            message: string;
            trigger: string;
            min?: undefined;
            max?: undefined;
        } | {
            min: number;
            max: number;
            message: string;
            trigger: string;
            required?: undefined;
        })[];
        desc: {
            validator: (rule: any, value: any, callback: any) => void;
            trigger: string;
        }[];
        upZeroInt: {
            validator: (rule: any, value: any, callback: any) => void;
            trigger: string;
        }[];
        upZeroIntCanNull: {
            validator: (rule: any, value: any, callback: any) => void;
            trigger: string;
        }[];
        passwordValid: {
            validator: any;
            trigger: string;
        }[];
    }>;
    datePickerOptions: import("vue").Ref<{
        disabledDate: (time: any) => boolean;
    }>;
    startEndArr: import("vue").Ref<never[]>;
    startEndArrSub: import("vue").Ref<never[]>;
    dialogTitle: import("vue").Ref<string>;
    detailDialog: import("vue").Ref<boolean>;
    isDialogEdit: import("vue").Ref<boolean>;
    dialogVisible: import("vue").Ref<boolean>;
    tableLoading: import("vue").Ref<boolean>;
    cascaderKey: import("vue").Ref<number>;
    SetKesDept: import("vue").Ref<{
        value: string;
        expandTrigger: string;
        label: string;
        children: string;
    }>;
    SetKesDeptNoStrictly: import("vue").Ref<{
        value: string;
        expandTrigger: string;
        label: string;
        children: string;
        checkStrictly: boolean;
    }>;
    cascaderOptionsOne: import("vue").Ref<never[]>;
    cascaderOptions: import("vue").Ref<never[]>;
    treeData: import("vue").Ref<never[]>;
    defaultProps: import("vue").Ref<{
        children: string;
        label: string;
    }>;
    casHandleChange: () => void;
    elMessage: (message?: string, type?: any) => void;
    elLoading: () => void;
    elNotify: (message?: string, type?: any, title?: string, duration?: number) => void;
    elConfirmNoCancelBtn: (title?: string, message?: string) => Promise<import("element-plus").MessageBoxData>;
    elConfirm: (title?: string, message?: string) => Promise<import("element-plus").MessageBoxData>;
};
export default useElementExample;
