<template>
  <div class="project-page-style">
    <FoldingCard :title="isEdit ? '编辑' : '新增'">
      <el-form ref="refForm" label-width="150px" :inline="false" :model="subForm">
        <el-form-item label="名字" prop="name" :rules="formRules.isNotNull('名字不能为空')">
          <el-input v-model="subForm.name" class="w-300px" placeholder="名字" />
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
const { isEdit, row } = getQueryParam()
if (isEdit) {
  onBeforeMount(async () => {
    const { data } = await getDetailByIdReq(row.id)
    reshowData(data, subForm)
  })
}
//获取详情数据
const getDetailByIdReq = (id) => {
  return axiosReq({
    url: '/basis-func/plateForm/selectById',
    data: { id },
    method: 'get'
  })
}
onMounted(() => {})
/*新增和更新*/
let subForm = reactive({
  id: '',
  name: ''
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
    url: '/basis-func/plateForm/insert',
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
    url: '/basis-func/plateForm/updateById',
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
