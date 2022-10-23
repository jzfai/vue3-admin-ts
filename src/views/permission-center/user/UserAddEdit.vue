<template>
  <div class="project-page-style">
    <FoldingCard :title="isEdit ? '编辑' : '新增'">
      <el-form ref="refForm" label-width="150px" :inline="false" :model="subForm">
        <el-form-item label="姓名" prop="name" :rules="formRules.isNotNull('姓名不能为空')">
          <el-input v-model="subForm.name" class="w-300px" placeholder="姓名" />
        </el-form-item>
        <el-form-item label="头像图片地址" prop="headImgUrl" :rules="formRules.isNull('请先上传头像图片地址')">
          <div class="rowSE">
            <img
              v-if="subForm.headImgUrl"
              :src="subForm.headImgUrl"
              class="w-120px h-120px"
              style="border-radius: 6px"
            />
            <div :class="[subForm.headImgUrl && 'ml-10px']" class="rowSS">
              <el-button type="primary" @click="headImgUrlUploadFile">
                <i class="el-icon-upload2" />
                上传
                <input
                  id="uploadFile"
                  ref="headImgUrlRef"
                  type="file"
                  accept=".png, .jpg"
                  style="display: none"
                  @change="headImgUrlUploadSave"
                />
              </el-button>
              <div class="ml-1">{{ chooseFileName }}</div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone" :rules="formRules.phone('手机号码不能为空')">
          <el-input v-model="subForm.phone" class="w-300px" placeholder="手机号码" />
        </el-form-item>
        <el-form-item label="角色id数组" :rules="formRules.isNull('请选择角色id数组')">
          <el-select multiple v-model="subForm.roleIdArr" placeholder="角色id数组" class="w-300px">
            <el-option v-for="item in roleIdData" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
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
    subForm.roleIdArr = JSON.parse(subForm.roleId)
  })
}
//获取详情数据
const getDetailByIdReq = (id) => {
  return axiosReq({
    url: '/basis-func/user/selectById',
    data: { id },
    method: 'get'
  })
}
onMounted(() => {
  roleIdReq()
})
let roleIdData = $ref([])
const roleIdReq = () => {
  let reqConfig = {
    url: '/basis-func/role/selectPage',
    method: 'get'
  }
  axiosReq(reqConfig).then(({ data }) => {
    roleIdData = data.records
  })
}
/*新增和更新*/
let subForm = reactive({
  id: '',
  name: '',
  headImgUrl: '',
  phone: '',
  roleIdArr: [],
  roleId: ''
})
const refForm = $ref(null)
let confirmBtnClick = () => {
  refForm.validate((valid) => {
    if (valid) {
      subForm.roleId = JSON.stringify(subForm.roleIdArr)
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
    url: '/basis-func/user/insert',
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
    url: '/basis-func/user/updateById',
    data: subForm,
    method: 'put',
    bfLoading: true
  }).then(() => {
    elMessage('更新成功')
    routerBack()
  })
}
/*4.上传文件*/
const headImgUrlRef = $ref(null)
const headImgUrlUploadFile = () => {
  headImgUrlRef.click()
}
const headImgUrlUploadSave = async () => {
  let { fileUrl } = await fileUpload(headImgUrlRef)
  subForm.headImgUrl = fileUrl
}

const { reshowData, fileUpload, chooseFileName, handleCancel, formRules } = useForm(subForm)
</script>

<style scoped lang="scss"></style>
