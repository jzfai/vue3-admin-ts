<template>
  <div class="mt-10px query-page-style">
    <!--条件搜索-->
    <el-form ref="refSearchForm" :inline="true" :model="searchForm">
      <el-form-item prop="name">
        <el-input v-model="searchForm.name" class="w-150px" placeholder="姓名" />
      </el-form-item>
      <el-form-item prop="phone">
        <el-input v-model="searchForm.phone" class="w-150px" placeholder="手机号码" />
      </el-form-item>
      <el-form-item>
        <!--查询按钮-->
        <el-button type="primary" @click="resetPageReq">查询</el-button>
        <el-button type="primary" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="rowES mb-10px">
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
      <el-table-column show-overflow-tooltip align="center" prop="name" label="姓名" min-width="100" />
      <el-table-column align="center" prop="headImgUrl" label="头像图片地址" min-width="100">
        <template #default="{ row }">
          <el-image
            :src="row.headImgUrl"
            style="border-radius: 6px"
            class="w-100px h-100px"
            :preview-teleported="true"
            :preview-src-list="[row.headImgUrl]"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="phone" label="手机号码" min-width="100" />
      <el-table-column show-overflow-tooltip align="center" prop="roleId" label="角色id数组" min-width="130" />
      <el-table-column show-overflow-tooltip align="center" prop="creator" label="创建人" min-width="100" />
      <el-table-column show-overflow-tooltip align="center" prop="deleted" label="是否激活" min-width="100">
        <template #default="{ row }">
          <span v-if="row.deleted == 0">激活</span>
          <span v-if="row.deleted == 1">未激活</span>
        </template>
      </el-table-column>
      <!--点击操作-->
      <el-table-column fixed="right" align="center" label="操作" width="120">
        <template #default="{ row }">
          <div class="table-operation-btn">
            <span @click="tableEditClick(row)">编辑</span>
            <span @click="tableDelClick(row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="rowCC mt-20px" v-if="totalPage >= 10">
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
defineOptions({ name: 'user' })
import { useTable } from '@/hooks/global/useTable'
import { Delete, FolderAdd } from '@element-plus/icons-vue'
import settings from '@/settings'
let searchForm = reactive({
  name: '',
  phone: ''
})
const selectPageReq = () => {
  const reqConfig = {
    url: '/basis-func//user/selectPage',
    method: 'get'
  }
  tableListReq(reqConfig)
}
//重置
const refSearchForm = $ref(null)
const resetForm = () => {
  refSearchForm.resetFields()
  dateRangePacking(['', ''])
  resetPageReq()
}

//批量删除
const multiDelBtnClick = () => {
  let reqConfig = {
    url: '/basis-func/user/deleteBatchIds',
    method: 'delete',
    bfLoading: true
  }
  multiDelBtnDill(reqConfig)
}

//单个删除
const tableDelClick = (row) => {
  const reqConfig = {
    url: '/basis-func/user/deleteById',
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
  routerPush('UserAddEdit')
}
const tableEditClick = (row) => {
  routerPush('UserAddEdit', { isEdit: true, row })
}
let tableDetailClick = (row) => {
  routerPush('UserDetail', { isDetail: true, row })
}
onMounted(() => {
  selectPageReq()
})

//引入table-query相关的hooks 方法
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
  resetPageReq,
  multiDelBtnDill,
  tableDelDill
} = useTable(searchForm, selectPageReq)
</script>

<style scoped lang="scss"></style>
