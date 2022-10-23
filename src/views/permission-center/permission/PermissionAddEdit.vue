<template>
  <div class="project-page-style">
    <FoldingCard :title="isEdit ? '编辑' : '新增'">
      <el-form ref="refForm" label-width="150px" :inline="false" :model="subForm">
        <el-form-item label="权限名称" prop="name" :rules="formRules.isNotNull('权限名称不能为空')">
          <el-input v-model="subForm.name" class="w-300px" placeholder="权限名称" />
        </el-form-item>
        <el-form-item label="权限类别" :rules="formRules.isNotNull('请选择权限类别')">
          <el-select v-model="subForm.category" placeholder="权限类别" class="w-300px">
            <el-option label="路由" :value="1" />
            <!--            <el-option label="内页" :value="2" />-->
            <el-option label="按钮" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="路由路径"
          v-if="[1].includes(subForm.category)"
          prop="path"
          :rules="formRules.isNotNull('路由路径不能为空')"
        >
          <el-input v-model="subForm.path" class="w-300px" placeholder="路由路径" />
        </el-form-item>
        <el-form-item
          label="组件"
          v-if="[1].includes(subForm.category)"
          prop="component"
          :rules="formRules.isNotNull('组件不能为空')"
        >
          <el-input v-model="subForm.component" class="w-300px" placeholder="组件" />
        </el-form-item>
        <el-form-item label="权限唯一CODE代码" prop="code" :rules="formRules.isNotNull('权限唯一CODE代码不能为空')">
          <el-input v-model="subForm.code" class="w-300px" placeholder="权限唯一CODE代码" />
        </el-form-item>
        <el-form-item label="平台名称" :rules="formRules.isNotNull('请选择平台名称')">
          <el-select v-model="subForm.plateFormId" placeholder="平台名称" class="w-300px">
            <el-option v-for="item in plateFormIdData" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="页面标题"
          v-if="[1].includes(subForm.category)"
          prop="title"
          :rules="formRules.isNull('页面标题不能为空')"
        >
          <el-input v-model="subForm.title" class="w-300px" placeholder="页面标题" />
        </el-form-item>

        <el-form-item label="父级权限ID(不填为0)" :rules="formRules.isNull('请选择父级权限ID(不填为0)')">
          <el-select filterable v-model="subForm.parentId" placeholder="父级权限ID(不填为0)" class="w-300px">
            <el-option v-for="item in parentIdData" :key="item.id" :label="item.name + item.code" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="subForm.sort" />
        </el-form-item>
        <el-form-item
          label="element的icon图标"
          v-if="[1].includes(subForm.category)"
          prop="elSvgIcon"
          :rules="formRules.isNull('element的icon图标不能为空')"
        >
          <el-input v-model="subForm.elSvgIcon" class="w-300px" placeholder="element的icon图标" />
        </el-form-item>
        <el-form-item
          label="总显示子项"
          v-if="[1].includes(subForm.category)"
          prop="redirect"
          :rules="formRules.isNull('总显示子项不能为空')"
        >
          <el-switch v-model="subForm.alwaysShow" :active-value="1" :inactive-value="0" class="ml-2" />
        </el-form-item>
        <el-form-item
          label="是否隐藏"
          v-if="[1].includes(subForm.category)"
          prop="redirect"
          :rules="formRules.isNull('子项是否隐藏不能为空')"
        >
          <el-switch v-model="subForm.hidden" :active-value="1" :inactive-value="0" class="ml-2" />
        </el-form-item>

        <el-form-item
          label="自定义的svg图标"
          v-if="[1].includes(subForm.category)"
          prop="icon"
          :rules="formRules.isNull('自定义的svg图标不能为空')"
        >
          <el-input v-model="subForm.icon" class="w-300px" placeholder="自定义的svg图标" />
        </el-form-item>
        <el-form-item
          label="重定向路径"
          v-if="[1].includes(subForm.category)"
          prop="redirect"
          :rules="formRules.isNull('重定向路径不能为空')"
        >
          <el-input v-model="subForm.redirect" class="w-300px" placeholder="重定向路径" />
        </el-form-item>
        <el-form-item
          label="权限介绍"
          v-if="[1].includes(subForm.category)"
          prop="intro"
          :rules="formRules.isNull('权限介绍不能为空')"
        >
          <el-input v-model="subForm.intro" type="textarea" rows="3" class="w-300px" placeholder="权限介绍" />
        </el-form-item>
        <el-form-item label="路由项额外字段" v-if="[1].includes(subForm.category)" prop="extra">
          <el-input v-model="subForm.extra" type="textarea" rows="3" class="w-300px" placeholder="路由项额外字段" />
        </el-form-item>
      </el-form>
      <div class="footer-btn columnCC">
        <div class="rowSS">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="confirmBtnClick">确定</el-button>
        </div>
      </div>
    </FoldingCard>
  </div>
</template>

<script setup lang="ts">
import useForm from '@/hooks/global/useForm'
const { getQueryParam, routerBack } = useVueRouter()
/*回显数据*/
const { isEdit, isAddChildren, row } = getQueryParam()
if (isEdit) {
  onBeforeMount(async () => {
    const { data } = await getDetailByIdReq(row.id)
    reshowData(data, subForm)
    // if (!isAddChildren) {
    //   subForm.parentId = ''
    // }
  })
}

//获取详情数据
const getDetailByIdReq = (id) => {
  return axiosReq({
    url: '/basis-func/permission/selectById',
    data: { id },
    method: 'get'
  })
}
onMounted(() => {
  plateFormIdReq()
  parentIdReq()
})
let plateFormIdData = $ref([])
const plateFormIdReq = () => {
  let reqConfig = {
    url: '/basis-func/plateForm/selectPage',
    method: 'get'
  }
  axiosReq(reqConfig).then(({ data }) => {
    plateFormIdData = data.records
  })
}
let parentIdData = $ref([])
const parentIdReq = () => {
  let reqConfig = {
    url: '/basis-func/permission/selectPage',
    method: 'get'
  }
  axiosReq(reqConfig).then(({ data }) => {
    parentIdData = data.records
  })
}
/*新增和更新*/
let subForm = reactive({
  id: '',
  name: '',
  category: '',
  code: '',
  plateFormId: '',
  title: '',
  sort: 20,
  parentId: '',
  redirect: '',
  path: '',
  component: '',
  elSvgIcon: '',
  icon: '',
  intro: '',
  hidden: 0,
  extra: '',
  alwaysShow: 0
})
const refForm = $ref(null)
let confirmBtnClick = () => {
  refForm.validate((valid) => {
    if (valid) {
      if (subForm.id) {
        updateReq()
      } else {
        insertReq()
      }
    } else {
      return false
    }
  })
}
const { elMessage } = useElement()
const insertReq = () => {
  const data = JSON.parse(JSON.stringify(subForm))
  delete data.id
  axiosReq({
    url: '/basis-func/permission/insert',
    data: data,
    method: 'post',
    bfLoading: true
  }).then(() => {
    elMessage('保存成功')
    routerBack()
  })
}
//更新
let updateReq = () => {
  return axiosReq({
    url: '/basis-func/permission/updateById',
    data: subForm,
    method: 'put',
    bfLoading: true
  }).then(() => {
    elMessage('更新成功')
    routerBack()
  })
}
/*4.上传文件*/

const { reshowData, fileUpload, chooseFileName, handleCancel, formRules } = useForm(subForm)
</script>

<style scoped lang="scss"></style>
