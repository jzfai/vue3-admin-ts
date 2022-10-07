<template>
  <div class="project-page-style">
    <FoldingCard :title="isEdit ? '编辑' : '新增'">
      <el-form ref="refForm" label-width="150px" :inline="false" :model="subForm">
        <el-form-item label="品牌名称" prop="name" :rules="formRules.isNotNull('品牌名称不能为空')">
          <el-input v-model="subForm.name" class="w-300px" placeholder="品牌名称" />
        </el-form-item>
        <el-form-item prop="image" label="品牌名称" :rules="formRules.isNotNull('品牌图片地址不能为空')">
          <div class="rowSE">
            <img v-if="subForm.image" :src="subForm.image" class="w-120px h-120px" style="border-radius: 6px" />
            <div :class="[subForm.image && 'ml-10px']" class="rowSS">
              <el-button type="primary" @click="imageUploadFile">
                <i class="el-icon-upload2" />
                上传
                <input
                  id="uploadFile"
                  ref="imageRef"
                  type="file"
                  accept=".png, .jpg"
                  style="display: none"
                  @change="imageUploadSave"
                />
              </el-button>
              <div class="ml-1">{{ chooseFileName }}</div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="品牌的首字母" prop="letter" :rules="formRules.isNotNull('品牌的首字母不能为空')">
          <el-input v-model="subForm.letter" class="w-300px" placeholder="品牌的首字母" />
        </el-form-item>
        <el-form-item label="排序" prop="seq" :rules="formRules.isNotNull('排序不能为空')">
          <el-input v-model="subForm.seq" class="w-300px" placeholder="排序" />
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
    url: '/integration-front/brand/selectById',
    data: { id },
    method: 'get'
  })
}
onMounted(() => {})
/*新增和更新*/
let subForm = reactive({
  name: '',
  image: '',
  letter: '',
  seq: ''
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
    url: '/integration-front/brand/insert',
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
    url: '/integration-front/brand/updateById',
    data: subForm,
    method: 'put',
    bfLoading: true
  }).then(() => {
    elMessage('更新成功')
    routerBack()
  })
}
/*4.上传文件*/
const imageRef = $ref(null)
const imageUploadFile = () => {
  imageRef.click()
}
const imageUploadSave = async () => {
  let { fileUrl } = await fileUpload(imageRef)
  subForm.image = fileUrl
}

const { reshowData, fileUpload, chooseFileName, handleCancel, formRules } = useForm(subForm)
</script>

<style scoped lang="scss"></style>
