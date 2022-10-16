<template>
  <div class="mb-10px rowSC">
    <el-button type="primary" size="small" @click="showCustomInput">文档字段填写</el-button>
    <el-button type="primary" @click="clearData">清空</el-button>
  </div>
  <el-table
    ref="refFormTable"
    :data="formTableData"
    border
    row-key="originField"
    @selection-change="handleSearchSelection"
  >
    <el-table-column prop="originField" label="字段名" align="center" width="120" />
    <el-table-column prop="desc" label="字段描述" align="center" min-width="140">
      <template #default="{ row }">
        <el-input v-model="row.desc" />
      </template>
    </el-table-column>
    <el-table-column prop="componentType" align="center" label="组件类型" width="250">
      <template #default="{ row }">
        <el-select v-model="row.componentType" filterable placeholder="组件类型">
          <el-option
            v-for="(item, index) in formComponentTypeArr"
            :key="index"
            :label="`${item.title}(${item.label})`"
            :value="item.label"
            @click="typeChooseItem(item, row)"
          />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column align="center" label="宽度" width="80">
      <template #default="{ row }">
        <el-input
          v-if="!['uploadImage', 'switch', 'checkbox', 'radio', 'table'].includes(row.componentType)"
          v-model="row.width"
          placeholder="控件的宽度"
        />
      </template>
    </el-table-column>
    <el-table-column prop="rule" align="center" label="校验规则" width="250">
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
    <el-table-column align="center" label="额外配置" min-width="170">
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
          v-if="['select', 'radio', 'checkbox', 'switch'].includes(row.componentType)"
          v-model="row.optionData"
          type="textarea"
          rows="3"
          placeholder="数据枚举"
        />
        <el-input v-if="['cascaderApi'].includes(row.componentType)" v-model="row.children" placeholder="childrenKey" />

        <!--    表格    -->
        <el-button v-if="['table'].includes(row.componentType)" text type="primary" @click="tableSetting(row)">
          设置
        </el-button>
      </template>
    </el-table-column>

    <el-table-column prop="width" align="center" label="操作" width="90">
      <template #default="{ row, $index }">
        <el-button text type="danger" @click="deleteSearchItem(row, $index)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <CustomInputColumn ref="refCustomInputColumn" @emitCICConfirm="emitCICConfirm" />
  <CustomTableColumn ref="refCustomTableColumn" @emitCICConfirm="emitTableConfirm" />
</template>

<script setup lang="ts">
import {
  changeDashToCase,
  changeTheFirstWordToCase,
  formComponentTypeArr,
  componentTypeMapping,
  getControlTypeByComponentType,
  isSelectType,
  ruleMapping,
  splitTheOptionArr
} from './generatorUtis'
import commonUtil from '@/utils/commonUtil'
import CustomInputColumn from './CustomInputColumn.vue'
import CustomTableColumn from './CustomTableColumn.vue'
import Sortable from 'sortablejs'

const reshowFormTableData = (checkColumnArr) => {
  formTableData = checkColumnArr
}
const setFormTableData = (checkColumnArr) => {
  JSON.parse(JSON.stringify(checkColumnArr)).forEach((fItem) => {
    const hasKey = commonUtil.findArrObjByKey(formTableData, 'columnName', fItem.columnName)
    if (!hasKey) {
      fItem.field = changeDashToCase(fItem.columnName) //_转驼峰
      fItem.fieldCase = changeTheFirstWordToCase(changeDashToCase(fItem.columnName)) //_转驼峰
      fItem.originField = fItem.columnName
      fItem.componentType = componentTypeMapping(fItem.field, fItem.desc) //数据库和前端控件中的类型做映射
      fItem.rule = 'isNotNull'
      fItem.isNeedInput = 'false'
      fItem.width = 300
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
      fItem.isTemplate = 'false'
      assetColumnInsert(fItem)
      formTableData.push(fItem)
    }
  })
}
const getFormTableData = () => {
  formTableData.forEach((fItem) => {
    if (fItem.optionData) {
      if (fItem.componentType === 'switch') {
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
  return formTableData
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
  // if (row.componentType === 'specialDict') {
  //   const specialObj = specialDictMapping[row.field]
  //   row.type = specialObj?.type
  //   row.dictCode = specialObj?.dictCode
  // }
  // //插入selectDict
  // if (row.componentType === 'selectDict') {
  //   const selectObj = selectDictMapping[row.field]
  //   row.dictCode = selectObj?.dictCode
  // }
}
let formTableData = $ref([])
let searchSelection = $ref([])
const handleSearchSelection = (val) => {
  searchSelection = val
}
//删除和新增
const deleteSearchItem = (row, index) => {
  formTableData.splice(index, 1)
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
      const currRow = formTableData.splice(oldIndex, 1)[0]
      formTableData.splice(newIndex, 0, currRow)
    }
  })
}
const clearData = () => {
  formTableData = []
}

//文档填入部分
const refCustomInputColumn = $ref(null)
const showCustomInput = () => {
  refCustomInputColumn.showModal(formTableData)
}
const emitCICConfirm = (data) => {
  setFormTableData([...formTableData, ...data])
}

//类型选择后触发
const typeChooseItem = (item, row) => {
  if (item.label === 'select') {
    row.isTemplate = 'true'
  }
}

//table设置
let tmpSaveTableRow = {
  tableListConfig: []
}
const refCustomTableColumn = $ref(null)
const tableSetting = (row) => {
  tmpSaveTableRow = row
  refCustomTableColumn.showModal(row.tableListConfig)
}
const emitTableConfirm = (data) => {
  tmpSaveTableRow.tableListConfig = data
}
defineExpose({ setFormTableData, formTableData, getFormTableData, clearData, reshowFormTableData })
</script>

<style scoped lang="scss"></style>
