import { ElMessageBox } from 'element-plus'
import momentMini from 'moment-mini'
const useFormExample = (subForm) => {
  /* 校验相关*/
  // 密码必须为6-18位字母、数字
  const passwordValid = (rule, value, callback) => {
    // mixins {field: "desc", fullField: "desc", type: "string", validator: ƒ}
    // console.log('mixins', rule, value)
    if (!/^(?![^a-zA-Z]+$)(?!\D+$)/.test(value)) {
      callback(new Error('6-18位字母、数字'))
    } else {
      callback()
    }
  }
  // 大于0的整数
  const upZeroInt = (rule, value, callback) => {
    // mixins {field: "desc", fullField: "desc", type: "string", validator: ƒ}
    // console.log('mixins', rule, value)
    if (!(/^\+?[1-9]\d*$/.test(value) && value < 100)) {
      callback(new Error('大于0'))
    } else {
      callback()
    }
  }
  // 大于0的整数
  const upZeroIntLast100 = (rule, value, callback) => {
    // mixins {field: "desc", fullField: "desc", type: "string", validator: ƒ}
    // console.log('mixins', rule, value)
    if (!(/^\+?[1-9]\d*$/.test(value) && value < 100)) {
      callback(new Error('大于0且小于100的整数'))
    } else {
      callback()
    }
  }
  //校验对象
  const formRules = {
    // 非空
    isNotNull: (msg) => [{ required: true, message: msg, trigger: 'blur' }],
    // 长度检验
    maxLength: (msg, max) => [
      { required: true, message: msg, trigger: 'blur' },
      { max: max, message: `最长为${max}个字符`, trigger: 'blur' }
    ],
    minLength: (msg, min) => [
      { required: true, message: msg, trigger: 'blur' },
      { min: min, message: `最长为${min}个字符`, trigger: 'blur' }
    ],
    minMaxLength: (msg, min, max) => [
      { required: true, message: msg, trigger: 'blur' },
      { min: min, max: max, message: '长度为17个字符', trigger: 'blur' }
    ],
    // 大于0
    upZeroInt: [{ validator: upZeroInt, trigger: 'blur' }],
    // 大于0且小于100
    upZeroIntLast100: [{ validator: upZeroIntLast100, trigger: 'blur' }],
    passwordValid: [{ validator: passwordValid, trigger: 'blur' }]
  }

  /*时间相关*/
  const timeState = reactive({
    startEndArr: [],
    //禁止选择之前的时间
    datePickerOptions: {
      disabledDate: (time) => {
        return time.getTime() < Date.now() - 86400000
      }
    }
  })
  /**
   * 回显数据
   * @param detailData  详情数据
   * @param subForm  回显的form
   * @author 熊猫哥
   * @date 2022/9/25 13:03
   */
  const reshowData = (detailData, subForm) => {
    Object.keys(detailData).forEach((fItem) => {
      Object.keys(subForm).forEach((sItem) => {
        if (fItem === sItem) {
          subForm[sItem] = detailData[sItem]
        }
      })
    })
  }
  /*上传文件相关*/
  const chooseFileName = ref(null)
  const fileUpload = (refSettingFile) => {
    return new Promise<{ fileUrl: string }>((resolve) => {
      const formData = new FormData()
      formData.append('file', refSettingFile.files[0])
      axiosReq({
        url: '/basis-func/upload/file',
        timeout: 30000,
        data: formData,
        method: 'post',
        bfLoading: true,
        isUploadFile: true
      })
        .then(({ data }) => {
          const { path } = data
          // 存储文件名称
          const filename = refSettingFile.value
          chooseFileName.value = filename.slice(filename.lastIndexOf('\\') + 1)
          const fileUrl = `${import.meta.env.VITE_APP_IMAGE_URL}/${path}`
          refSettingFile.value = ''

          resolve({ fileUrl })
        })
        .catch(() => {
          chooseFileName.value = null
          refSettingFile.value = ''
        })
    })
  }

  //取消
  const handleCancel = () => {
    ElMessageBox.confirm('现在离开将不会保留您的操作，是否离开？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      useVueRouter().routerBack()
    })
  }

  /**
   * time range dill
   * @param timeArr choose the time
   * @param searchForm
   * @author 熊猫哥
   * @date 2022/9/25 14:02
   */
  const dateRangePacking = (timeArr) => {
    if (timeArr && timeArr.length === 2) {
      subForm.startTime = timeArr[0]
      //取今天23点
      subForm.endTime = momentMini(timeArr[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
    } else {
      subForm.startTime = ''
      subForm.endTime = ''
    }
  }

  return {
    formRules,
    ...toRefs(timeState),
    reshowData,
    fileUpload,
    chooseFileName,
    handleCancel
  }
}

export const useForm = useFormExample

export default useFormExample
