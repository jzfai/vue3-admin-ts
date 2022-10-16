<template>
  <div class="mb-10px rowSC">
    <el-button type="primary" @click="copyJson">复制json数据</el-button>
    <el-button type="primary" @click="clearData">清空</el-button>
  </div>
  <el-table
    ref="refFormTable"
    row-key="originField"
    class="form-table-config"
    :data="formTableData"
    border
    @selection-change="handleFormSelection"
  >
    <el-table-column prop="tableName" label="表名" align="center" width="120">
      <template #default="{ row }">
        <el-input v-model="row.tableName" placeholder="tableName" />
      </template>
    </el-table-column>
    <el-table-column prop="originField" label="字段名" align="center" width="120">
      <template #default="{ row }">
        <el-input v-model="row.originField" placeholder="字段名" />
      </template>
    </el-table-column>
    <el-table-column prop="desc" label="字段描述" min-width="120">
      <template #default="{ row }">
        <el-input v-model="row.desc" placeholder="字段描述" />
      </template>
    </el-table-column>
    <el-table-column prop="isNotShowSwagger" align="center" label="文档中显示" width="100">
      <template #default="{ row }">
        <el-switch
          v-model="row.isNotShowSwagger"
          inline-prompt
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="false"
          inactive-value="true"
        />
      </template>
    </el-table-column>
    <el-table-column prop="isNeedInput" align="center" label="是否必填" width="100">
      <template #default="{ row }">
        <el-switch
          v-model="row.isNeedInput"
          inline-prompt
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="true"
          inactive-value="false"
        />
      </template>
    </el-table-column>
    <el-table-column prop="rule" align="center" label="校验规则" min-width="100">
      <template #default="{ row }">
        <el-select v-model="row.rule" filterable placeholder="组件类型">
          <el-option
            v-for="(item, index) in ruleMapping"
            :key="index"
            :label="`${item.label}(${item.key})`"
            :value="item.key"
          />
        </el-select>
      </template>
    </el-table-column>

    <el-table-column prop="width" align="center" label="操作" width="90">
      <template #default="{ row, $index }">
        <el-button text type="primary" @click="deleteFormItem(row, $index)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import {
  changeDashToCase,
  changeTheFirstWordToCase,
  componentTypeArr,
  componentTypeMapping,
  tbTypeMapping,
  ruleMapping,
  splitDescReturnDesc,
  splitDescReturnOptionData,
  splitTheOptionArr,
  changeDashToCaseAndFirstWord
} from './generatorUtis'
import commonUtil from '@/utils/commonUtil'
const setFormTableData = (checkColumnArr) => {
  checkColumnArr.forEach((fItem) => {
    const hasKey = commonUtil.findArrObjByKey(formTableData, 'columnName', fItem.columnName)
    if (!hasKey) {
      fItem.field = changeDashToCase(fItem.columnName) //_转驼峰
      fItem.fieldCase = changeDashToCaseAndFirstWord(fItem.columnName) //_转驼峰
      fItem.originField = fItem.columnName
      fItem.tbName = fItem.columnName

      fItem.type = tbTypeMapping(fItem.dataType) //数据库和java中的类型做映射
      fItem.componentType = componentTypeMapping(fItem.dataType, fItem.columnComment, fItem.columnName) //数据库和前端控件中的类型做映射
      fItem.rule = 'notValid'
      fItem.value = 'value'
      fItem.label = 'label'
      fItem.children = 'children'
      fItem.isNotShowSwagger = 'false'
      fItem.isNeedInput = 'true'
      fItem.desc = splitDescReturnDesc(fItem.columnComment)
      fItem.optionData = splitDescReturnOptionData(fItem.columnComment)
      //api
      fItem.api = ''
      fItem.method = 'get'
      fItem.labelKey = 'name'
      fItem.valueKey = 'code'
      formTableData.push(fItem)
    }
  })
}
/*查询配置*/
let currentChooseRow = $ref({})
const chooseRowHandle = (row) => {
  currentChooseRow = row
}
let formTableData = $ref([])
let formSelection = $ref([])
const handleFormSelection = (val) => {
  formSelection = val
}
//删除和新增
const deleteFormItem = (row, index) => {
  formTableData.splice(index, 1)
}
//实现表格拖拽排序
//拖拽
import generatorHook from './hook/generatorHook'
generatorHook(formTableData, 'form-table-config')

const getFormTableData = () => {
  formTableData.forEach((fItem) => {
    fItem.optionDataArr = splitTheOptionArr(fItem.optionData)
  })
  return formTableData
}

const reshowFormTableData = (checkColumnArr) => {
  formTableData = checkColumnArr
}
const clearData = () => {
  formTableData = []
}
import useClipboard from 'vue-clipboard3'
const { toClipboard } = useClipboard()
const copyJson = () => {
  let collectionObj = {}
  formTableData.forEach((fItem) => {
    collectionObj[fItem.field] = fItem.desc
  })
  toClipboard(JSON.stringify(collectionObj))
  useElement().elMessage('复制成功')
}
defineExpose({ setFormTableData, getFormTableData, reshowFormTableData })
</script>

<style scoped lang="scss"></style>
