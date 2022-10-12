<template>
  <div class="mt-10px query-page-style">
    <!--操作-->
    <div class="rowBS">
      <div class="rowSS mr-30px">
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
            <el-input v-model="searchForm.name" class="w-150px" placeholder="模板名字" />
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
      <el-table-column show-overflow-tooltip align="center" prop="name" label="配置名字" min-width="100" />
      <el-table-column show-overflow-tooltip align="center" prop="generatorConfig" label="生成的配置" min-width="100" />
      <!--点击操作-->
      <el-table-column fixed="right" align="center" label="操作" width="180">
        <template #default="{ row }">
          <div class="table-operation-btn">
            <span @click="tableDelClick(row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div v-if="totalPage >= 10" class="rowCC mt-20px">
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
  name: ''
})

const selectPageReq = () => {
  const reqConfig = {
    url: '/integration-front/configSave/selectPage',
    bfLoading: true,
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
    url: '/integration-front/configSave/deleteBatchIds',
    method: 'delete',
    bfLoading: true
  }
  multiDelBtnDill(reqConfig)
}

//单个删除
const tableDelClick = (row) => {
  const reqConfig = {
    url: '/integration-front/configSave/deleteById',
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
  routerPush('ConfigSaveAddEdit')
}
const tableEditClick = (row) => {
  routerPush('ConfigSaveAddEdit', { isEdit: true, row })
}
let tableDetailClick = (row) => {
  routerPush('ConfigSaveDetail', { isDetail: true, row })
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
