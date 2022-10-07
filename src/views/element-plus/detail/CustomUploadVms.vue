<template>
  <div id="CustomUploadVms">
    <div class="mt-4">自定义模板上传</div>
    <div class="mt-1 mb-2">请选择您要上传的模板(多个模板一起上传)</div>
    <div class="imgUpContainer rowSS">
      <!--图片列表-->
      <div class="imgShowList rowSS">
        <div v-for="(item, index) in uploadFileList" :key="index" class="imgItem">
          <!--右上角删除按钮-->
          <el-icon class="imgStyle"><Document class="imgStyle" /></el-icon>
          <el-icon class="rightDel" @click="deleteFile(index)"><CloseBold /></el-icon>
          <div class="imageName">{{ item.name }}</div>
        </div>
      </div>
      <!--图片上传-->
      <div class="rowSE">
        <div class="packingImageContainer columnCC">
          <el-icon class="packingIconStyle"><Plus /></el-icon>
          <input
            ref="refSettingFile"
            type="file"
            class="inputStyle"
            accept=".vm, .vue, .java, .py"
            multiple
            @change="fileOnChange"
          />
        </div>
        <el-button type="primary" class="ml-2" :disabled="!uploadFileList.length" @click="uploadTheVmsTemp">
          上传
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
let uploadFileList = $ref([])
import { Plus, CloseBold, Document } from '@element-plus/icons-vue'

import commonUtil from '@/utils/commonUtil'
const fileOnChange = () => {
  // console.log('wo被触发了')
  // let length = fileList.value.length
  // if (length >= 5) {
  //   ElMessage({ message: '文件上传数不能大于2个', type: 'warning' })
  //   return
  // }
  let fileObj = refSettingFile.files

  Object.values(fileObj).forEach((fItem) => {
    if (!commonUtil.findArrObjByKey(uploadFileList, 'name', fItem.name)) {
      uploadFileList.push(fItem)
    }
  })
  refSettingFile.value = ''
}

let { proxy } = getCurrentInstance()
const uploadTheVmsTemp = async () => {
  let formData = new FormData()
  uploadFileList.forEach((fItem) => {
    formData.append('file', fItem)
  })
  //获取parent中的json数据
  let jsonData = await proxy.$parent.generatorSubData()
  formData.append('jsonData', JSON.stringify(jsonData))
  fileUploadSave(formData)
}

const deleteFile = (index) => {
  uploadFileList.splice(index, 1)
}

const refSettingFile = $ref(null)
const fileUploadSave = (formData) => {
  axiosReq({
    url: '/Generator/uploadFiles',
    data: formData,
    method: 'post',
    bfLoading: true,
    isUploadFile: true,
    isDownLoadFile: true
  }).then((res) => {
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', decodeURI(res.headers?.exportfilename))
    document.body.appendChild(link)
    link.click()
  })
}
</script>

<style scoped lang="scss">
$packingWidth: 120px;
$borderRadius: 6px;
.imgUpContainer {
}
.imgShowList {
  .imgItem {
    margin-right: 6px;
    position: relative;
    .imgStyle {
      border-radius: $borderRadius;
      width: $packingWidth;
      height: $packingWidth;
    }
    .imageName {
      width: $packingWidth;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .rightDel {
      background-color: #eee;
      border-radius: 14px;
      position: absolute;
      font-size: 16px;
      top: 1px;
      right: 1px;
      cursor: pointer;
    }
    .rightDel:hover {
      background-color: #999;
    }
  }
}
//图片上传
.packingImageContainer {
  position: relative;
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: $borderRadius;
  box-sizing: border-box;
  width: $packingWidth;
  height: $packingWidth;
  cursor: pointer;

  .packingIconStyle {
    font-size: 30px;
  }
  .inputStyle {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    width: $packingWidth;
    height: $packingWidth;
  }
}
</style>
