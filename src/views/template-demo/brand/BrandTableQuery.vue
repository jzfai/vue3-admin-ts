<template>
  <div class="mt-10px query-page-style">
    <!--操作-->
    <div class="rowBS">
      <div class="rowSS mr-30px">
        <el-button type="primary" @click="addBtnClick">
          <el-icon style="vertical-align: middle">
            <FolderAdd />
          </el-icon>
          <span style="vertical-align: middle">增加</span>
        </el-button>
        <el-button type="primary" @click="multiDelBtnClick">
          <el-icon style="vertical-align: middle">
            <Delete />
          </el-icon>
          <span style="vertical-align: middle">删除</span>
        </el-button>
      </div>
      <div class="rowSS">
        <!--条件搜索-->
        <el-form ref="refSearchForm" :inline="true" :model="searchForm">
          <el-form-item prop="name">
            <el-input v-model="searchForm.name" class="w-100px" placeholder="品牌名字" />
          </el-form-item>
          <el-form-item prop="startEndArr">
            <el-date-picker
              v-model="searchForm.startEndArr"
              type="daterange"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD HH:mm:ss"
              @change="dateRangePacking"
              class="w-150px"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
        </el-form>
        <!--查询按钮-->
        <el-button type="primary" @click="resetBtnClick">查询</el-button>
        <el-button type="primary" @click="resetForm()">重置</el-button>
      </div>
    </div>
    <!--表格和分页-->
    <el-table
      id="resetElementDialog"
      ref="refuserTable"
      :height="`calc(100vh - ${settings.delWindowHeight})`"
      border
      :data="tableListData"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="50" />
      <el-table-column show-overflow-tooltip align="center" prop="name" label="品牌名字" min-width="100" />
      <el-table-column align="center" prop="image" label="图片地址" min-width="100">
        <template #default="{ row }">
          <el-image
            :src="row.image"
            :preview-teleported="true"
            style="border-radius: 6px; z-index: 1000"
            class="w-100px h-100px"
            :preview-src-list="[row.image]"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="letter" label="首字母" min-width="100" />
      <el-table-column show-overflow-tooltip align="center" prop="seq" label="排序" min-width="100" />
      <!--点击操作-->
      <el-table-column fixed="right" align="center" label="操作" width="180">
        <template #default="{ row }">
          <div class="table-operation-btn">
            <span @click="tableEditClick(row)">编辑</span>

            <span @click="tableDelClick(row)">删除</span>
            <span @click="tableDetailClick(row)">详情</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="rowEC mt-20px" v-if="totalPage >= 10">
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
defineOptions({ name: 'Brand' })
import { useTable } from '@/hooks/global/useTable'
import { Delete, FolderAdd } from '@element-plus/icons-vue'
import settings from '@/settings'

let searchForm = reactive({
  name: '',
  startEndArr: ''
})

const selectPageReq = () => {
  const reqConfig = {
    url: '/integration-front/brand/selectPage',
    method: 'get'
  }
  tableListReq(reqConfig)
}

//重置
const refSearchForm = $ref(null)
const resetForm = () => {
  refSearchForm.resetFields()
}

//批量删除
const multiDelBtnClick = () => {
  let reqConfig = {
    url: '/integration-front/brand/deleteBatchIds',
    method: 'delete',
    bfLoading: true
  }
  multiDelBtnDill(reqConfig)
}

//单个删除
const tableDelClick = (row) => {
  const reqConfig = {
    url: '/integration-front/brand/deleteById',
    data: { id: row.id },
    isParams: true,
    method: 'delete',
    bfLoading: true
  }
  tableDelDill(row, reqConfig)
}

//添加和修改详情
const { routerPush } = useVueRouter()
const addBtnClick = () => {
  routerPush('BrandAddEdit')
}
const tableEditClick = (row) => {
  routerPush('BrandAddEdit', { isEdit: true, row })
}
let tableDetailClick = (row) => {
  routerPush('BrandDetail', { isDetail: true, row })
}
onMounted(() => {
  selectPageReq()
})

//引入table-query相关的hooks
let {
  pageNum,
  pageSize,
  totalPage,
  tableListData,
  tableListReq,
  dateRangePacking,
  handleSelectionChange,
  handleCurrentChange,
  handleSizeChange,
  resetBtnClick,
  multiDelBtnDill,
  tableDelDill
} = useTable(searchForm, selectPageReq)
</script>

<style scoped lang="scss"></style>
