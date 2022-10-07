<template>
    <div class="project-page-style">
                        <FoldingCard ref="baseInfo" title="品牌详情" class="mb12">
                <div class="mt-24px">
                        <div class="detail-item">
                            <span class="w-150px">品牌名称:</span>
                                 <output>{{detailData.name}}</output>
                        </div>
                        <div class="detail-item">
                            <span class="w-150px">品牌图片地址:</span>
                                 <el-image
                                        :src="detailData.image"
                                        style="border-radius: 6px"
                                        class="w-100px h-100px"
                                        :preview-src-list="[detailData.image]"
                                        fit="cover"
                                />
                        </div>
                </div>
                <div class="mt-24px">
                        <div class="detail-item">
                            <span class="w-150px">品牌的首字母:</span>
                                 <output>{{detailData.letter}}</output>
                        </div>
                        <div class="detail-item">
                            <span class="w-150px">排序:</span>
                                 <output>{{detailData.seq}}</output>
                        </div>
                </div>
                <div class="mt-24px">
                </div>
        </FoldingCard>
            </div>
</template>

<script setup lang="ts">
    const { getQueryParam, routerBack } = useVueRouter()
    /*回显数据*/
    let tableData=$ref([])
    let detailData=$ref({})
    const { isDetail, row } = getQueryParam()
    if (isDetail) {
        onBeforeMount(async () => {
            const { data } = await getDetailByIdReq(row.id)
            detailData=data
        })
    }
    const getDetailByIdReq = (id) => {
        return axiosReq({
            url: '/integration-front/brand/selectById',
            data: { id },
            method: 'get'
        })
    }
</script>

<style lang="scss" scoped>
    .detail-row-container:not(:last-child) {
        margin-right: 76px;
    }

    .detail-item {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        margin-bottom: 18px;
        color: #595959;
    }

    .detail-item > span {
        display: inline-block;
    }
</style>
