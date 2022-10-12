<template>
  <el-dialog
    v-if="dialogVisible"
    v-model="dialogVisible"
    title="根据文档输入字段生成"
    width="1000px"
    :before-close="handleClose"
  >
    <div class="h-700px">
      <!--  请求json生成   -->
      <div class="mb-20px">
        <el-form-item label="填写json生成" prop="isAdd" label-position="left">
          <el-switch
            v-model="showJson"
            inline-prompt
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="true"
            :inactive-value="false"
          />
        </el-form-item>
        <div v-if="showJson" class="rowSE">
          <el-input v-model.trim="textareaValue" class="w-400px" type="textarea" rows="10" />
          <el-button type="primary" class="ml-20px" @click="genJsonToTable">生成</el-button>
        </div>
      </div>

      <el-table class="column-table" row-key="uuid" :data="tableData" stripe style="width: 100%" height="400px" border>
        <el-table-column prop="field" label="字段名" align="center" width="100">
          <template #default="{ row }">
            <el-input v-model="row.field" />
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="字段描述" align="center" min-width="140">
          <template #default="{ row }">
            <el-input v-model="row.desc" />
          </template>
        </el-table-column>
        <el-table-column prop="componentType" align="center" label="组件类型" width="250">
          <template #default="{ row }">
            <el-select v-model="row.componentType" filterable placeholder="组件类型">
              <el-option
                v-for="(item, index) in formTableTypeArr"
                :key="index"
                :label="`${item.title}(${item.label})`"
                :value="item.label"
                @click="typeChooseItem(item, row)"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="isTemplate" align="center" label="是否自定义模板" width="110">
          <template #default="{ row }">
            <el-switch
              v-model="row.isTemplate"
              inline-prompt
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="true"
              inactive-value="false"
            />
          </template>
        </el-table-column>
        <el-table-column prop="width" align="center" label="宽度" width="80">
          <template #default="{ row }">
            <el-input
              v-if="!['uploadImage', 'switch', 'checkbox', 'radio', 'table'].includes(row.componentType)"
              v-model="row.width"
              placeholder="控件的宽度"
            />
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
            <el-input
              v-if="['cascaderApi'].includes(row.componentType)"
              v-model="row.children"
              placeholder="childrenKey"
            />
          </template>
        </el-table-column>

        <el-table-column prop="desc" label="删除" width="80">
          <template #default="{ $index }">
            <el-button text type="danger" @click="deleteItem($index)">删除</el-button>
          </template>
        </el-table-column>
        时
      </el-table>
      <!--      <div class="mt-15px">-->
      <!--        <el-button type="primary" @click="addTableColumn">新增</el-button>-->
      <!--      </div>-->
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="confirmBtnClick">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {
  changeDashToCase,
  formTableTypeArr,
  componentTypeMapping,
  isSelectType,
  splitTheOptionArr
} from './generatorUtis'
import { useSortTable } from '@/hooks/useSortTable'
let showJson = $ref(true)
let textareaValue = $ref('{"name":"名字","age":"年龄"}')
let tableData = $ref([])
import { ElMessageBox } from 'element-plus'
let dialogVisible = $ref(false)
const handleClose = (done) => {
  ElMessageBox.confirm('退出将清空您配置的数据').then(() => {
    dialogVisible = false
    done()
  })
}

const showModal = (tableArr) => {
  dialogVisible = true
  nextTick(() => {
    if (tableArr?.length) {
      let objValue = {}
      tableArr.forEach((fItem) => {
        objValue[fItem.originField] = fItem.desc
      })
      textareaValue = JSON.stringify(objValue)
    }

    if (tableArr?.length) {
      tableData = tableArr
    }
    //排序
    useSortTable().rowDrop(tableData, '.column-table')
  })
}
const { guid } = useCommon()
// const addTableColumn = () => {
//   let fItem = { columnName: '', desc: '' }
//   setTableItem(fItem)
// }
const deleteItem = (index) => {
  tableData.splice(index, 1)
}
const emits = defineEmits(['emitCICConfirm'])

const confirmBtnClick = () => {
  emits(
    'emitCICConfirm',
    tableData.map((mItem) => {
      if (mItem.optionData) {
        mItem.optionDataArr = splitTheOptionArr(mItem.optionData)
      }
      return mItem
    })
  )
  dialogVisible = false
  tableData = []
}

//类型选择后触发
const typeChooseItem = (item, row) => {
  if (['select', 'selectApi'].includes(item.label)) {
    row.isTemplate = 'true'
  }
}

//json生成table
const genJsonToTable = () => {
  if (textareaValue && typeof textareaValue === 'string') {
    const ToJson = dillScssExportToJson(textareaValue)
    //设置到table
    let columnNameArr = tableData.map((mItem) => mItem.columnName)
    Object.entries(JSON.parse(ToJson)).forEach(([key, value]) => {
      let fItem = { columnName: key, desc: value }
      if (!columnNameArr.includes(fItem.columnName)) {
        setTableItem(JSON.parse(JSON.stringify(fItem)))
      }
    })
  }
}

const setTableItem = (fItem) => {
  fItem.field = fItem.columnName
  fItem.originField = fItem.columnName
  fItem.componentType = componentTypeMapping(fItem.field, fItem.desc) //数据库和前端控件中的类型做映射
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
  fItem.api = ''
  fItem.method = 'get'
  fItem.labelKey = 'name'
  fItem.valueKey = 'code'
  fItem.isTemplate = 'true'
  fItem.uuid = guid()

  tableData.push(fItem)
}
//dill string to Json
const dillScssExportToJson = (scssExportJson) => {
  return scssExportJson.replace(/:export\s*/, '').replace(/[\s+\r\n]/g, '')
}
defineExpose({ showModal })
</script>

<style lang="scss" scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}

.modal-style {
  width: 1000px !important;
  min-height: 500px;
}
</style>
