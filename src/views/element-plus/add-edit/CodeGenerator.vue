<template>
  <div class="project-page-style">
    <FoldingCard title="基础配置">
      <el-form ref="refForm" label-width="115px" :inline="true" :model="basicConfig" class="pr-5">
        <div class="mb-10px">
          <el-form-item label="选择回显配置" label-position="left">
            <el-select v-model="chooseTmp" filterable placeholder="选择回显配置" class="w-300px">
              <el-option
                v-for="item in configList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                @click="reshowConfig(item)"
              />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="作者" prop="author" :rules="formRules.isNotNull()" label-position="left">
          <el-input v-model="basicConfig.author" placeholder="请输入作者" class="w-300px" />
        </el-form-item>
        <el-form-item label="生成的api文件名" prop="apiFileName" :rules="formRules.isNotNull()" label-position="left">
          <el-input v-model="basicConfig.apiFileName" placeholder="生成的api文件名" class="w-300px" />
        </el-form-item>
      </el-form>
    </FoldingCard>

    <!-- 前端请求接口配置  -->
    <FoldingCard title="接口配置">
      <el-form ref="refForm" label-width="100px" :inline="true" :model="apiConfig" class="pr-5">
        <el-form-item label="新增接口" prop="insertApi" :rules="formRules.isNotNull()" label-position="left">
          <el-input v-model="apiConfig.insertApi" placeholder="新增接口" class="w-380px" />
        </el-form-item>
        <el-form-item label="新增方法" prop="insertMethod" :rules="formRules.isNotNull()" label-position="left">
          <el-input v-model="apiConfig.insertMethod" placeholder="新增方法" class="w-80px" />
        </el-form-item>
        <el-form-item label="更新接口" prop="updateApi" :rules="formRules.isNotNull()" label-position="left">
          <el-input v-model="apiConfig.updateApi" placeholder="更新接口" class="w-380px" />
        </el-form-item>
        <el-form-item label="更新方法" prop="updateMethod" :rules="formRules.isNotNull()" label-position="left">
          <el-input v-model="apiConfig.updateMethod" placeholder="更新方法" class="w-80px" />
        </el-form-item>
        <el-form-item label="详情接口" prop="detailApi" :rules="formRules.isNotNull()" label-position="left">
          <el-input v-model="apiConfig.detailApi" placeholder="详情接口" class="w-380px" />
        </el-form-item>
        <el-form-item label="详情方法" prop="detailMethod" :rules="formRules.isNotNull()" label-position="left">
          <el-input v-model="apiConfig.detailMethod" placeholder="详情方法" class="w-80px" />
        </el-form-item>
      </el-form>
    </FoldingCard>

    <FoldingCard title="提交form字段配置">
      <FormTableConfig ref="refFormTableConfig" />
    </FoldingCard>

    <FoldingCard title="保存和生成模板">
      <div class="mb-10px">保存当前配置</div>
      <div class="rowSS mb-20px">
        <el-input v-model="saveFileName" class="w-200px mr-10px" placeholder="保存文件名(可以不填写)" />
        <el-button type="primary" @click="saveTmp">保存</el-button>
      </div>

      <el-button type="primary" class="mt-20px" @click="generatorBaseModelTemp">点击生成模板</el-button>
      <!--      <CustomUploadVms ref="refCustomUploadVms" />-->
    </FoldingCard>
  </div>
</template>

<script setup lang="ts">
import CustomUploadVms from './CustomUploadVms.vue'
const { currentTime } = useCommon()
const { formRules, elMessage } = useElement()
/*项目和作者信息配置*/
let basicConfig = $ref({
  author: '熊猫哥',
  apiFileName: '',
  dataTime: currentTime
})
/*前端api接口配置*/
let apiConfig = $ref({
  insertApi: '',
  insertMethod: 'post',
  updateApi: '',
  updateMethod: 'put',
  detailApi: '',
  detailMethod: 'get'
})

/*表字段信息（可多选）*/
const refFormTableConfig = $ref(null)

//table
import FormTableConfig from './FormTableConfig.vue'
import type { AxiosReqTy } from '~/common'
import momentMini from 'moment-mini'
import { changeTheFirstWordToCase } from '@/views/element-plus/index/generatorUtis'

//生成模板
const generatorSubData = () => {
  return new Promise((resolve) => {
    const formTableConfig = refFormTableConfig.getFormTableData()
    const tableShowData = refFormTableConfig.getFormTableData()
    basicConfig.apiFileNameFirstCase = changeTheFirstWordToCase(basicConfig.apiFileName)
    let generatorData = {
      basicConfig,
      apiConfig,
      saveFileName,
      queryConfig: formTableConfig,
      tableList: tableShowData
    }
    resolve(generatorData)
  })
}

const { downLoadTemp } = useCommon()
const generatorBaseModelTemp = async () => {
  const subData: any = await generatorSubData()
  let reqConfig: AxiosReqTy = {
    url: '/basis-func/element-plus/addEdit',
    method: 'post',
    isDownLoadFile: true,
    data: subData
  }
  axiosReq(reqConfig).then((res) => {
    downLoadTemp(res)
  })
}

//保存模板
let saveFileName = $ref('')
const saveName = 'element-plus-add-edit'
const saveTmp = async () => {
  const subData = await generatorSubData()
  let reqConfig: AxiosReqTy = {
    url: '/basis-func/generatorConfigSave/insert',
    method: 'post',
    data: {
      name: `${saveFileName} ${saveName}(${momentMini(new Date()).format('YYYY-MM-DD HH:mm:ss')})`,
      generatorConfig: JSON.stringify(subData)
    }
  }
  axiosReq(reqConfig).then((res) => {
    elMessage('配置保存成功')
    getSaveTmp()
  })
}
//获取模板
onMounted(() => {
  getSaveTmp()
})

//查询模板
let configList = $ref([])
let chooseTmp = $ref(saveName)
const getSaveTmp = () => {
  let reqConfig: AxiosReqTy = {
    url: '/basis-func/generatorConfigSave/selectPage',
    method: 'get',
    bfLoading: true,
    data: { pageSize: 50, pageNum: 1, name: saveName }
  }
  axiosReq(reqConfig).then(({ data }) => {
    configList = data?.records
    //回显第一个元素
    for (let fItem of configList) {
      if (fItem.name.includes(saveName)) {
        chooseTmp = fItem.name
        reshowData(fItem)
        return
      }
    }
  })
}

//配置选择
const reshowConfig = (item) => {
  reshowData(item)
}
const reshowData = (fItem) => {
  let generatorConfig = JSON.parse(fItem.generatorConfig)
  basicConfig = generatorConfig.basicConfig
  apiConfig = generatorConfig.apiConfig
  saveFileName = generatorConfig.saveFileName
  refFormTableConfig.reshowFormTableData(generatorConfig.queryConfig)
  refFormTableConfig.reshowFormTableData(generatorConfig.tableList)
}
defineExpose({ generatorSubData })
</script>

<style scoped lang="scss"></style>
