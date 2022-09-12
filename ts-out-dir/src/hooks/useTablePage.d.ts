export default function (selectPageReq: any): {
    pageNum: import("vue").Ref<number>;
    pageSize: import("vue").Ref<number>;
    handleCurrentChange: (val: number) => void;
    handleSizeChange: (val: number) => void;
};
