export default function (selectPageReq) {
    const pageNum = ref(1);
    const pageSize = ref(10);
    const handleCurrentChange = (val) => {
        pageNum.value = val;
        selectPageReq();
    };
    const handleSizeChange = (val) => {
        pageSize.value = val;
        selectPageReq();
    };
    onMounted(() => { });
    return {
        pageNum,
        pageSize,
        handleCurrentChange,
        handleSizeChange
    };
}
//# sourceMappingURL=useTablePage.js.map