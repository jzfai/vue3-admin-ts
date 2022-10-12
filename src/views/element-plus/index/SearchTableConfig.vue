<template>
  <div class="mb-10px rowSC">
    <el-button type="primary" size="small" @click="showCustomInput">文档字段填写</el-button>
    <el-button type="primary" @click="clearData">清空</el-button>
  </div>
  <el-table
    ref="refSearchTable"
    :data="searchTableData"
    border
    row-key="originField"
    @selection-change="handleSearchSelection"
  >
    <el-table-column prop="field" label="字段名" align="center" width="130">
      <template #default="{ row }">
        <el-input v-model="row.field" />
      </template>
    </el-table-column>
    <el-table-column prop="desc" label="字段描述" align="center" width="140">
      <template #default="{ row }">
        <el-input v-model="row.desc" />
      </template>
    </el-table-column>
    <el-table-column prop="componentType" align="center" label="组件类型" width="250">
      <template #default="{ row }">
        <el-select v-model="row.componentType" filterable placeholder="组件类型">
          <el-option
            v-for="(item, index) in searchTableComponentTypeArr"
            :key="index"
            :label="`${item.title}(${item.label})`"
            :value="item.label"
          />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column prop="width" align="center" label="宽度" width="80">
      <template #default="{ row }">
        <el-input v-model="row.width" placeholder="控件的宽度" />
      </template>
    </el-table-column>

    <el-table-column align="center" label="select/selectApi额外配置" min-width="170">
      <template #default="{ row }">
        <el-input
          v-if="['selectApi', 'cascaderApi'].includes(row.componentType)"
          v-model="row.api"
          type="textarea"
          rows="3"
          placeholder="请求地址"
        />
        <el-input
          v-if="['selectApi', 'cascaderApi'].includes(row.componentType)"
          v-model="row.method"
          placeholder="请求方法"
        />
        <el-input
          v-if="['selectApi', 'cascaderApi'].includes(row.componentType)"
          v-model="row.labelKey"
          placeholder="label-key"
        />
        <div class="mt-1">
          <el-input
            v-if="['selectApi', 'cascaderApi'].includes(row.componentType)"
            v-model="row.valueKey"
            placeholder="value-key"
          />
        </div>

        <el-input
          v-if="['select', 'radio', 'radio', 'checkbox', 'switch'].includes(row.componentType)"
          v-model="row.optionData"
          type="textarea"
          rows="3"
          placeholder="数据枚举"
        />
        <el-input v-if="['cascaderApi'].includes(row.componentType)" v-model="row.children" placeholder="childrenKey" />

        <el-input
          v-if="['selectDict', 'specialDict'].includes(row.componentType)"
          v-model="row.dictCode"
          class="mt-1"
          placeholder="dictCode"
        />
        <el-input
          v-if="['specialDict'].includes(row.componentType)"
          v-model="row.type"
          class="mt-1"
          placeholder="type"
        />
      </template>
    </el-table-column>

    <el-table-column prop="width" align="center" label="操作" width="90">
      <template #default="{ row, $index }">
        <el-button text type="danger" @click="deleteSearchItem(row, $index)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <CustomInputColumn ref="refCustomInputColumn" @emitCICConfirm="emitCICConfirm" />
</template>

<script setup lang="ts">
import {
  changeDashToCase,
  changeTheFirstWordToCase,
  searchTableComponentTypeArr,
  componentTypeMapping,
  getControlTypeByComponentType,
  isSelectType,
  selectDictMapping,
  specialDictMapping,
  splitTheOptionArr
} from './generatorUtis'
import commonUtil from '@/utils/commonUtil'
import CustomInputColumn from './CustomInputColumn.vue'
import Sortable from 'sortablejs'

const reshowSearchTableData = (checkColumnArr) => {
  searchTableData = checkColumnArr
}

const setSearchTableData = (checkColumnArr) => {
  JSON.parse(JSON.stringify(checkColumnArr)).forEach((fItem) => {
    const hasKey = commonUtil.findArrObjByKey(searchTableData, 'columnName', fItem.columnName)
    if (!hasKey) {
      fItem.field = changeDashToCase(fItem.columnName) //_转驼峰
      fItem.fieldCase = changeTheFirstWordToCase(changeDashToCase(fItem.columnName)) //_转驼峰
      fItem.originField = fItem.columnName
      fItem.componentType = componentTypeMapping(fItem.field, fItem.desc) //数据库和前端控件中的类型做映射
      fItem.rule = 'isNotNull'
      fItem.children = 'children'
      fItem.width = 150
      //select
      if (isSelectType(fItem.desc)) {
        const index = fItem.desc.indexOf(';')
        fItem.optionData = fItem.desc
          .substr(index + 1)
          .replace(/[\r\n\t]/g, '')
          .replace(/\ +/g, '')
        fItem.desc = fItem.desc.substring(0, index)
      }
      //api
      fItem.api = ''
      fItem.method = 'get'
      fItem.labelKey = 'name'
      fItem.valueKey = 'code'
      assetColumnInsert(fItem)
      searchTableData.push(fItem)
    }
  })
}
const getSearchTableData = () => {
  searchTableData.forEach((fItem) => {
    if (fItem.optionData) {
      if (fItem.componentType === 'radio') {
        let keyArr = fItem.optionData.split(',')
        keyArr.forEach((fsItem) => {
          const keyArrObjArr = fsItem.split(':')
          fItem.activeValue = keyArrObjArr[0]
          fItem.inactiveValue = keyArrObjArr[1]
        })
      } else {
        fItem.optionDataArr = splitTheOptionArr(fItem.optionData)
      }
    }
  })
  return searchTableData
}

/**
 *
 *  插入资管家特殊的字段
 * @return row
 * @author 邝华
 * @email kuanghua@aulton.com
 * @date 2022-06-09 15:20
 */
const assetColumnInsert = (row) => {
  //插入资管家特殊的枚举类型controlType
  row.controlType = getControlTypeByComponentType(row.componentType)
  //插入specialDict
  if (row.componentType === 'specialDict') {
    const specialObj = specialDictMapping[row.field]
    row.type = specialObj?.type
    row.dictCode = specialObj?.dictCode
  }
  //插入selectDict
  if (row.componentType === 'selectDict') {
    const selectObj = selectDictMapping[row.field]
    row.dictCode = selectObj?.dictCode
  }
}
let searchTableData = $ref([])
let searchSelection = $ref([])
const handleSearchSelection = (val) => {
  searchSelection = val
}
//删除和新增
const deleteSearchItem = (row, index) => {
  searchTableData.splice(index, 1)
}
//拖拽
onMounted(() => {
  nextTick(() => {
    rowDrop()
  })
})
const rowDrop = () => {
  // 获取到element-ui封装的表格标签
  const tbody = document.querySelector(' .el-table__body-wrapper tbody') as HTMLElement
  Sortable.create(tbody, {
    animation: 180,
    delay: 0,
    onEnd({ newIndex, oldIndex }) {
      const currRow = searchTableData.splice(oldIndex, 1)[0]
      searchTableData.splice(newIndex, 0, currRow)
    }
  })
}
const clearData = () => {
  searchTableData = []
}

//文档填入部分
const refCustomInputColumn = $ref(null)
const showCustomInput = () => {
  refCustomInputColumn.showModal()
}
const emitCICConfirm = (data) => {
  setSearchTableData([...searchTableData, ...data])
}

defineExpose({ setSearchTableData, searchTableData, getSearchTableData, clearData, reshowSearchTableData })
</script>

<style scoped lang="scss"></style>
