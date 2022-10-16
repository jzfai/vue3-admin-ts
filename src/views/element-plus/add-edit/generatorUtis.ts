/*
 * generator 工具方法
 * @author: 邝华
 * */

/*
 * ‘_’连接转为驼峰
 * //- hyphen
 * */
export const changeDashToCase = (str) => {
  let changeStr = ``
  const arr = str.split(`_`)
  const newArr = arr.map((ele, idx) => {
    return idx === 0 ? ele : ele[0].toUpperCase() + ele.slice(1)
  })
  changeStr = newArr.join(``)
  return changeStr
}

//首字母转大写
export const changeTheFirstWordToCase = (str) => {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * 类型映射
 * @param type 数据库类型
 * @return  java类型
 * @author 邝华
 * @date 2022/6/4 9:54
 */
export const tbTypeMapping = (type) => {
  // varchar,char,text,longText -->String
  // decimal->Double
  // int,bit,tinyint->Integer
  // bigInt->Long
  //datetime,timestamp->Date
  //Date->Object
  if ('varchar,char,text,longText'.includes(type)) {
    return 'String'
  } else if ('decimal'.includes(type)) {
    return 'Double'
  } else if ('int,bit,tinyint'.includes(type)) {
    return 'Integer'
  } else if ('bigInt'.includes(type)) {
    return 'Long'
  } else if ('datetime,timestamp'.includes(type)) {
    return 'Long'
  } else if ('Date'.includes(type)) {
    return 'Object'
  } else {
    return '未知类型' + type
  }
}

/**
 * searchTable组件类型
 * @return
 * @author 邝华
 * @date 2022/6/4 10:44
 */
export const searchTableComponentTypeArr = [
  { label: 'input', title: 'input' },
  { label: 'select', title: 'select' },
  { label: 'selectApi', title: 'selectApi' },
  { label: 'daterange', title: 'daterange' },
  { label: 'selectDict', title: 'selectDict' },
  { label: 'specialDict', title: 'specialDict' }
]

/**
 * form组件类型
 * @return
 * @author 邝华
 * @date 2022/6/4 10:44
 */
export const formComponentTypeArr = [
  { label: 'input', title: '输入框' },
  { label: 'textarea', title: '多行输入框' },
  { label: 'select', title: '选择框' },
  { label: 'selectApi', title: '选择框请求' },
  // { label: 'cascader', title: '级联选择' },
  // { label: 'cascaderApi', title: '级联选择请求' },
  { label: 'radio', title: '单选' },
  { label: 'checkbox', title: 'checkbox多选' },
  { label: 'switch', title: 'switch' },
  { label: 'date', title: '日期' },
  { label: 'daterange', title: '日期范围' },
  { label: 'uploadImage', title: '上传图片' },
  // { label: 'selectDict', title: 'selectDict' },
  // { label: 'specialDict', title: 'specialDict' },
  { label: 'table', title: '表格' },
  { label: '', title: '空类型' }
]

/**
 * form 中table的类型配置
 * @return
 * @author 邝华
 * @date 2022/6/4 10:44
 */
export const formTableTypeArr = [
  { label: 'input', title: '输入框' },
  { label: 'select', title: '选择框' },
  { label: 'selectApi', title: '选择框请求' }
]

/**
 * table表格组件类型
 * @return
 * @author 邝华
 * @date 2022/6/4 10:44
 */
export const listTableComponentTypeArr = [
  { label: 'input', title: 'input' },
  { label: 'select', title: 'select' },
  { label: 'custom', title: 'custom' },
  { label: '', title: '空类型' }
]

//资管家中specialDict特殊字典类型映射
export const specialDictMapping = {
  companyId: { desc: '创建单位', filed: 'companyId', dictCode: 'vehTaxiCompanyEnum', type: 'vehTaxiCompany' },
  approveStatus: {
    desc: '审批进度',
    filed: 'approveStatus',
    dictCode: 'approveStatusDataDictionaryEnum',
    type: 'approveStatus'
  },
  taxiCompanyId: { desc: '所属机构', filed: 'taxiCompanyId', dictCode: 'companyDictEnum', type: 'company' },
  orgCode: { desc: '公司', filed: 'orgCode', dictCode: 'vehTaxiCompanyEnum', type: 'vehTaxiCompany' },
  status: {
    desc: '分配站点',
    filed: 'status',
    dictCode: 'stationAssignStatusDataDictionaryEnum',
    type: 'stationAssignStatus'
  }
}

//资管家中selectDict特殊字典类型映射
export const selectDictMapping = {
  cityName: { desc: '城市', filed: 'cityName', dictCode: 'cityListEnum' },
  cityId: { desc: '城市', filed: 'cityId', dictCode: 'cityListEnum' },
  isPaid: { desc: '交易状态', filed: 'isPaid', dictCode: 'paidEnum' },
  consumeType: { desc: '计费方式', filed: 'consumeType', dictCode: 'consumeTypeEnum' },
  payType: { desc: '支付方式', filed: 'payType', dictCode: 'payTypeEnum' },
  carActualType: { desc: '可用车型', filed: 'carActualType', dictCode: 'carModelListEnum' },
  deviceType: { desc: '设备型号', filed: 'deviceType', dictCode: 'stationModelListEnum' },
  stationStatus: { desc: '站端状态', filed: 'stationStatus', dictCode: 'stationStatusListEnum' }
}

//资管家中controllerType
export const getControlTypeByComponentType = (componentType) => {
  if (componentType.includes('select')) {
    return 'elSelect'
  } else if (componentType.includes('data')) {
    return 'elDataPicker'
  }
  return 'elInput'
}

//校验规则
export const ruleMapping = [
  { key: 'isNotNull', label: '必填' },
  { key: 'isNull', label: '非必填' },
  { key: 'upZeroInt', label: '整数' },
  { key: 'zeroInt', label: '整数(包括0)' },
  { key: 'email', label: '邮箱' },
  { key: 'phone', label: '手机号' },
  { key: 'idCard', label: '身份证' }
]
/**
 * 组件类型映射
 * @param null
 * @return
 * @author 邝华
 * @date 2022/6/4 10:23
 */
export const componentTypeMapping = (columnName, desc) => {
  if (specialDictMapping[columnName]) {
    return 'specialDict'
  }
  if (selectDictMapping[columnName]) {
    return 'selectDict'
  }
  //select
  if (isSelectType(desc)) {
    return 'selectApi'
  }
  //datetime
  if (desc.includes('时间') || columnName.includes('time')) {
    return 'daterange'
  }
  //空类型 id
  if (columnName.includes('id')) {
    return ''
  }
  return 'input'
}

/**
 *
 * @param string 传入的string
 * @example '1:大于短信,2：阿里短信'
 * @return
 * @author 邝华
 * @email kuanghua@aulton.com
 * @date 2022-06-09 14:33
 */
const { elMessage } = useElement()
export const isSelectType = (desc) => {
  return desc.includes(';')
}
export const splitTheOptionArr = (string) => {
  if (!string || !string.includes(':') || !string.includes(',')) {
    elMessage(string + '传入有误（标准格式：1:大于短信,2:阿里短信）', 'warning')
    return []
  }
  let tsArr = string.split(',')
  tsArr = tsArr.map((mfItem) => {
    //去除空格和换行
    return mfItem.replace(/[\r\n]/g, '').replace(/\ +/g, '')
  })

  return tsArr.map((mItem) => {
    const splitArr = mItem.split(':')
    return {
      value: splitArr[0],
      label: splitArr[1]
    }
  })
}
