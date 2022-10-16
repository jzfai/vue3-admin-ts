<template>
  <div class="project-page-style pb-5">
    <!--    <div class="mt-2 mb-2">-->
    <!--      <el-alert-->
    <!--        title="新一代的低代码生成平台，提供数据源能力，根据数据库字段自动生成基于vue3-admin-plus和micro-service-plus的模版。-->
    <!--      可以使用默认模版和自定义模版生成，经过测试可以为企业提升40%左右的开发效率"-->
    <!--        type="warning"-->
    <!--      />-->
    <!--    </div>-->
    <!--项目和作者信息配置-->
    <FoldingCard title="基础信息配置">
      <div class="mb-10px">
        <el-form-item label="选择回显配置" label-position="left">
          <el-select v-model="chooseTmp" filterable placeholder="选择回显配置" class="w-300px">
            <el-option
              v-for="item in configList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              @click="reshowData(item)"
            />
          </el-select>
        </el-form-item>
      </div>
      <el-form ref="refForm" label-width="120px" :inline="true" :model="basicConfig" :rules="formRules" class="pr-50px">
        <el-form-item label="作者" prop="author" :rules="formRules.isNotNull()" label-position="left">
          <el-input v-model="basicConfig.author" placeholder="作者" />
        </el-form-item>
        <el-form-item label="包名" prop="packageName" :rules="formRules.isNotNull()" label-position="left">
          <el-input v-model="basicConfig.packageName" class="w-200px" placeholder="包名" />
        </el-form-item>

        <!--        <el-form-item label="实体基础类名" prop="basicClassName" :rules="formRules.isNotNull()" label-position="left">-->
        <!--          <el-input v-model="basicConfig.basicClassName" class="w-200px" placeholder="实体基础类名" />-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="实体基础类注释" prop="basicClassDesc" :rules="formRules.isNotNull()" label-position="left">-->
        <!--          <el-input v-model="basicConfig.basicClassDesc" class="w-200px" placeholder="实体基础类注释" />-->
        <!--        </el-form-item>-->
      </el-form>
    </FoldingCard>
    <FoldingCard title="库和表选取">
      <div class="rowSS">
        <div>数据库链接：</div>
        <el-input v-model="dataBaseUrl" class="w-600px mr-10px" placeholder="dataBaseUrl" />
        <el-button type="primary" @click="searchDataBase">查询表</el-button>
      </div>
      <div class="rowSS mt-20px">
        <div>数据表链接：</div>
        <el-input v-model="dbTableUrl" class="w-600px" placeholder="dbTableUrl" />
      </div>
      <!-- 获取库和表信息 -->
      <div class="mt-20px mb-10px">请选择表(支持多表)</div>
      <el-checkbox-group v-model="dbRadio">
        <el-checkbox
          v-for="(item, index) in dbData"
          :key="index"
          :label="item.tableName"
          @change="dbRadioClick(item, dbRadio.includes(item.tableName))"
        >
          {{ item.tableName }}
        </el-checkbox>
      </el-checkbox-group>

      <div v-if="chooseDbArr.length" class="mt-3 mb-1">选中的表</div>
      <el-button
        v-for="(item, index) in chooseDbArr"
        :key="index"
        type="primary"
        text
        @click="dbChooseRadioClick(item)"
      >
        {{ item.tableName }}({{ item.tableComment }})
      </el-button>
      <!-- 表信息-->
      <!--      <div class="mb-10px mt-30px">表信息</div>-->
      <!--      <div class="rowSC mt-10px">-->
      <!--        <el-input v-model="tbName" class="w-150px mr-10px" placeholder="tbName" />-->
      <!--        <el-button :disabled="!tbName" type="primary" @click="searchDbTable">查询字段</el-button>-->
      <!--      </div>-->
    </FoldingCard>

    <FoldingCard title="字段配置">
      <div class="mb-10px rowSC">
        <div>表字段（点击选择）</div>
        <el-button text class="mr-10px" type="primary" @click="checkAllColumn">全选</el-button>
      </div>
      <div class="mt-1">
        <el-button
          v-for="(item, index) in tbData"
          :key="index"
          type="success"
          text
          :label="item"
          @click="checkColumnClick(item)"
        >
          {{ item.columnName }}({{ item.columnComment }})
        </el-button>

        <!-- 选中的字段-->
        <div class="mt-30px mb-10px rowSC">
          <span>选中的字段处理</span>
          <el-button text type="danger" class="ml-1" @click="clearAllColumn">清空</el-button>
        </div>
        <div class="rowSC flex-wrap">
          <div v-for="(item, index) in checkColumnArr" :key="index" class="rowSC mr-20px mt-10px mb-30px">
            <span style="color: #e6a23c">{{ item.columnName }}({{ item.columnComment }})</span>
            <ElSvgIcon name="CircleClose" :size="14" style="cursor: pointer" @click="deleteColumn(index)" />
          </div>
        </div>
        <div v-if="checkColumnArr.length" class="mt-20px">
          <el-button type="primary" @click="generatorToSearch">同步到查询</el-button>
          <el-button type="primary" @click="generatorToTable">同步到表格</el-button>
          <el-button type="primary" @click="generatorToForm">同步到表单</el-button>
        </div>
      </div>
    </FoldingCard>
    <FoldingCard title="表字段关系配置">
      <!--      <div class="mb-10px rowSS">-->
      <!--        <el-input v-model="multiTableName" placeholder="多表实体类名" class="w-150px mr-2" />-->
      <!--        <el-input v-model="multiTableDesc" placeholder="多表相关注释" class="w-150px" />-->
      <!--      </div>-->
      <div v-for="(item, index) in multiTableConfig" :key="index" class="rowSC">
        <div class="mr-10px">{{ item.originTableName }}：</div>
        <el-radio-group v-model="item.orgAssociationKey">
          <el-radio
            v-for="(pkaItem, pkaIndex) in item.priKeyArr"
            :key="pkaIndex"
            :label="pkaItem"
            @click="pkaRadioClick(item, pkaItem)"
          >
            {{ pkaItem }}
          </el-radio>
        </el-radio-group>
        <ElSvgIcon
          class="ml-10px"
          name="CircleClose"
          :size="14"
          style="cursor: pointer"
          @click="deleteMultiTable(index)"
        />
      </div>
    </FoldingCard>

    <FoldingCard title="字段用途配置">
      <!--  查询配置  -->
      <div class="mt-30px mb-10px">查询字段</div>
      <SearchTableConfig ref="refSearchTableConfig" />
      <!--  表格配置  -->
      <div class="mt-30px mb-10px">表格显示字段</div>
      <ListTableConfig ref="refListTableConfig" />
      <!--  提交from表单配置  -->
      <div class="mt-30px mb-10px">新增和修改字段</div>
      <FormTableConfig ref="refFormTableConfig" />
    </FoldingCard>

    <FoldingCard title="配置保存和模版生成">
      <div class="mb-10px">保存当前配置</div>
      <div class="rowSS mb-20px">
        <el-input v-model="saveFileName" class="w-200px mr-10px" placeholder="保存文件名(可以不填写)" />
        <el-button type="primary" @click="saveTmp">保存</el-button>
        <el-button type="primary" @click="copyJson">复制json数据</el-button>
      </div>

      <div class="mb-10px">模版生成</div>
      <el-button type="success" @click="generatorBackTempZip">mybatis-plus基础模版生成</el-button>
    </FoldingCard>
  </div>
</template>

<script setup>
import {
  changeDashToCase,
  changeDashToCaseAndFirstWord,
  changeTheFirstWordToCase,
  removeTbOrT,
  tbTypeMapping
} from '@/views/code-generator/generatorUtis'
// import CustomUploadVms from './CustomUploadVms.vue'

const { formRules, elMessage } = useElement()
import commonUtil from '@/utils/commonUtil'
/*项目和作者信息配置*/
let basicConfig = $ref({
  author: '',
  packageName: '',
  basicClassName: '',
  basicClassDesc: '',
  dataTime: ''
})
basicConfig.dataTime = momentMini(new Date()).format('YYYY-MM-DD HH:mm:ss')

/*获取库和表信息*/
//库
let dataBaseUrl = $ref(
  'https://github.jzfai.top/micro-service-api/basis-func/dataBase/getAllDatabaseOrTable/micro-service-plus'
)
onBeforeMount(() => {
  if (dataBaseUrl) {
    searchDataBase()
  }
})
let dbRadio = $ref([])
let chooseDbArr = $ref([])
let chooseDbRadio = $ref(null)
let dbData = $ref([])
const dbRadioClick = (item, check) => {
  if (check) {
    if (!commonUtil.findArrObjByKey(chooseDbArr, 'tableName', item.tableName)) {
      item.id = useCommon().guid()
      chooseDbArr.push(item)
    }
  } else {
    commonUtil.deleteArrObjByKey(chooseDbArr, 'tableName', item.tableName)
  }
}

const removeTag = (tableName) => {
  commonUtil.deleteArrObjByKey(chooseDbArr, 'tableName', tableName)
}
//保存tb的信息
let currentTableInfo = $ref({})
const dbChooseRadioClick = (item) => {
  tbName = item.tableName
  tbData = []
  currentTableInfo = {
    tableName: changeDashToCase(removeTbOrT(item.tableName)),
    originTableName: item.tableName,
    tableDesc: item.tableComment,
    tableNameCase: changeTheFirstWordToCase(changeDashToCase(removeTbOrT(item.tableName))),
    uniKey: 'id'
  }
  if (dataBaseUrl) {
    searchDbTable()
  }
}
const searchDataBase = () => {
  let reqConfig = {
    baseURL: dataBaseUrl,
    method: 'get',
    isParams: true
  }
  axiosReq(reqConfig).then(({ data }) => {
    dbData = data
  })
}
//表
let dbTableUrl = $ref(dataBaseUrl)
let tbName = $ref('')
let tbData = $ref([])
let multiTableConfig = $ref([])
const deleteMultiTable = (index) => {
  multiTableConfig.splice(index, 1)
}
const searchDbTable = () => {
  let reqConfig = {
    baseURL: `${dataBaseUrl}/${tbName}`,
    method: 'get',
    isParams: true
  }
  axiosReq(reqConfig).then(({ data }) => {
    //得到主键key
    let priKeyArr = []
    let priKeyItemArr = []
    data.forEach((fItem) => {
      if (fItem.columnKey) {
        priKeyArr.push(fItem.columnName)
        priKeyItemArr.push(fItem)
      }
    })
    //插入表信息
    const firstData = data[0]
    const priKeyArrFirst = priKeyArr[0]
    const priKeyArrLast = priKeyArr[priKeyArr.length - 1]
    const priKeyArrItemFirst = priKeyItemArr[0]
    const priKeyArrItemLast = priKeyItemArr[priKeyItemArr.length - 1]
    if (!commonUtil.findArrObjByKey(multiTableConfig, 'originTableName', firstData.tableName)) {
      let multiTableNameString = ''
      multiTableConfig.forEach((fItem) => {
        multiTableNameString += fItem.tableNameCase.substr(
          fItem.tableNameCase.length - 4,
          fItem.tableNameCase.length - 1
        )
      })
      multiTableName = multiTableNameString

      multiTableConfig.push({
        ...currentTableInfo,
        tableFieldArr: data.map((fItem) => {
          fItem.field = changeDashToCase(fItem.columnName) //_转驼峰
          fItem.desc = fItem.columnComment
          fItem.fieldCase = changeDashToCaseAndFirstWord(fItem.columnName) //_转驼峰
          fItem.originField = fItem.columnName
          fItem.tbName = fItem.columnName
          fItem.type = tbTypeMapping(fItem.dataType)
          return fItem
        }),
        uniKey: changeDashToCase(priKeyArrFirst),
        orgUniKey: priKeyArrFirst,
        uniKeyType: tbTypeMapping(priKeyArrItemFirst.dataType),
        priKeyArr,
        priKeyItemArr,
        orgAssociationKey: priKeyArrLast,
        associationKey: changeDashToCase(priKeyArrLast),
        associationKeyCase: changeTheFirstWordToCase(changeDashToCase(priKeyArrLast)),
        associationKeyType: tbTypeMapping(priKeyArrItemLast.dataType)
      })
    }
    tbData = data
  })
}
//多表关系配置
let multiTableName = $ref(null)
let multiTableDesc = $ref('')
const pkaRadioClick = (item, pkaItem) => {
  item.associationKey = changeDashToCase(pkaItem)
}
//全选
const checkAllColumn = () => {
  checkColumnArr = JSON.parse(JSON.stringify(tbData))
}
const clearAllColumn = () => {
  checkColumnArr = []
}

const checkColumnClick = (cItem) => {
  if (!commonUtil.findArrObjByKey(checkColumnArr, 'columnName', cItem.columnName)) {
    checkColumnArr.push(cItem)
  }
}
const deleteColumn = (dIndex) => {
  checkColumnArr.splice(dIndex, 1)
}
let checkColumnArr = $ref([])
/*显示表字段信息（可多选）*/
//Search
import SearchTableConfig from './SearchTableConfig.vue'
const refSearchTableConfig = $ref(null)
const generatorToSearch = () => {
  refSearchTableConfig.setSearchTableData(JSON.parse(JSON.stringify(checkColumnArr)))
}
//table
import ListTableConfig from './ListTableConfig.vue'
const refListTableConfig = $ref(null)
const generatorToTable = () => {
  refListTableConfig.setListTableData(JSON.parse(JSON.stringify(checkColumnArr)))
}
//Form
import FormTableConfig from './FormTableConfig.vue'
import momentMini from 'moment-mini'
const refFormTableConfig = $ref(null)
const generatorToForm = () => {
  refFormTableConfig.setFormTableData(JSON.parse(JSON.stringify(checkColumnArr)))
}

//生成模板
const generatorSubData = () => {
  return new Promise((resolve) => {
    const searchTableConfig = refSearchTableConfig.getSearchTableData()
    const searchTableGroup = commonUtil.arrGroupByKey(searchTableConfig, 'tableName')
    const listTableConfig = refListTableConfig.getListTableData()
    const listTableGroup = commonUtil.arrGroupByKey(searchTableConfig, 'tableName')
    const formTableConfig = refFormTableConfig.getFormTableData()
    const formTableGroup = commonUtil.arrGroupByKey(searchTableConfig, 'tableName')

    //多表数据处理
    multiTableConfig.forEach((fItem) => {
      fItem.tableQueryArr = searchTableGroup[fItem.originTableName]
      fItem.tableShowArr = listTableGroup[fItem.originTableName]
      fItem.tableFormArr = formTableGroup[fItem.originTableName]
    })

    if (multiTableConfig.length > 1) {
      basicConfig.isMultiTable = true
    }

    //取multiTableConfig第一项
    const multiTableFistItem = multiTableConfig[0]
    //设置dbTableConfig
    let dbTableConfig = {
      multiTableName,
      multiTableNameCase: changeTheFirstWordToCase(multiTableName),
      multiTableDesc: multiTableDesc,
      ...multiTableFistItem
    }
    // let reqApiPre = ''
    // if (basicConfig.isMultiTable) {
    //   reqApiPre = `/${basicConfig.serviceName}/${dbTableConfig.multiTableName}`
    // } else {
    //   reqApiPre = `/${basicConfig.serviceName}/${dbTableConfig.tableName}`
    // }

    let generatorData = {
      basicConfig,
      multiTableConfig,
      dbTableConfig,
      queryConfig: searchTableConfig,
      tableConfig: listTableConfig,
      formConfig: formTableConfig,

      //此处保存的数据主要用于回显
      dataBaseUrl,
      dbRadio,
      saveFileName,
      chooseDbRadio,
      dbTableUrl,
      tbName,
      checkColumnArr,
      chooseDbArr,
      tbData
    }
    resolve(generatorData)
  })
}

import useClipboard from 'vue-clipboard3'
const { toClipboard } = useClipboard()
const copyJson = async () => {
  const subData = await generatorSubData()
  toClipboard(JSON.stringify(subData))
  elMessage('复制成功')
}

//保存模板
let saveFileName = $ref('')
const saveName = 'mybatis-plus-basic'
const saveTmp = async () => {
  const subData = await generatorSubData()
  let reqConfig = {
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

//查询模板
onMounted(() => {
  getSaveTmp()
})
let configList = $ref([])
let chooseTmp = $ref(saveName)
const getSaveTmp = () => {
  let reqConfig = {
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
const reshowData = (fItem) => {
  let generatorConfig = JSON.parse(fItem.generatorConfig)
  refSearchTableConfig.reshowSearchTableData(generatorConfig.queryConfig)
  refListTableConfig.reshowListTableData(generatorConfig.tableConfig)
  refFormTableConfig.reshowFormTableData(generatorConfig.formConfig)

  dataBaseUrl = generatorConfig.dataBaseUrl
  dbRadio = generatorConfig.dbRadio
  chooseDbRadio = generatorConfig.chooseDbRadio
  dbTableUrl = generatorConfig.dbTableUrl
  tbName = generatorConfig.tbName
  checkColumnArr = generatorConfig.checkColumnArr
  chooseDbArr = generatorConfig.chooseDbArr
  saveFileName = generatorConfig.saveFileName
  tbData = generatorConfig.tbData
  basicConfig = generatorConfig.basicConfig
  multiTableConfig = generatorConfig.multiTableConfig
}

/**
 * 生成前端模版
 * @return
 * @author 熊猫哥
 * @date 2022/6/26 14:40
 */
const generatorBackTempZip = async () => {
  let generatorData = await generatorSubData()
  let reqConfig = {
    url: '/basis-func/mybatis-plus/generatorMybatisPlusBasicTmp',
    method: 'post',
    isDownLoadFile: true,
    data: generatorData
  }
  axiosReq(reqConfig).then((res) => {
    //得到主键key
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', decodeURI(res.headers?.exportfilename))
    document.body.appendChild(link)
    link.click()
  })
}

defineExpose({ generatorSubData })
</script>

<style scoped lang="scss"></style>
