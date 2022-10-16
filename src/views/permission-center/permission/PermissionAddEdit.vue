







<template>
    <div class="project-page-style">
        <FoldingCard :title="isEdit ? '编辑' : '新增'">
            <el-form ref="refForm" label-width="150px" :inline="false" :model="subForm">
         <el-form-item label="权限名称" prop="name" :rules="formRules.isNotNull('权限名称不能为空')">
            <el-input v-model="subForm.name" class="w-300px" placeholder="权限名称"/>
        </el-form-item>
         <el-form-item label="权限类别" :rules="formRules.isNotNull('请选择权限类别')">
            <el-select v-model="subForm.category" placeholder="权限类别" class="w-300px">
                    <el-option label="路由" value="1"/>
                    <el-option label="内页" value="2"/>
                    <el-option label="按钮" value="3"/>
            </el-select>
        </el-form-item>
         <el-form-item label="权限唯一CODE代码" prop="code" :rules="formRules.isNotNull('权限唯一CODE代码不能为空')">
            <el-input v-model="subForm.code" class="w-300px" placeholder="权限唯一CODE代码"/>
        </el-form-item>
         <el-form-item label="平台名称" :rules="formRules.isNotNull('请选择平台名称')">
            <el-select v-model="subForm.plateFormId" placeholder="平台名称" class="w-300px">
                <el-option
                        v-for="item in plateFormIdData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"/>
            </el-select>
        </el-form-item>
         <el-form-item label="页面标题" prop="title" :rules="formRules.isNull('页面标题不能为空')">
            <el-input v-model="subForm.title" class="w-300px" placeholder="页面标题"/>
        </el-form-item>
         <el-form-item label="父级权限ID(不填为0)" :rules="formRules.isNull('请选择父级权限ID(不填为0)')">
            <el-select v-model="subForm.parentId" placeholder="父级权限ID(不填为0)" class="w-300px">
                <el-option
                        v-for="item in parentIdData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"/>
            </el-select>
        </el-form-item>
         <el-form-item label="重定向路径" prop="redirect" :rules="formRules.isNull('重定向路径不能为空')">
            <el-input v-model="subForm.redirect" class="w-300px" placeholder="重定向路径"/>
        </el-form-item>
         <el-form-item label="路由路径" prop="path" :rules="formRules.isNull('路由路径不能为空')">
            <el-input v-model="subForm.path" class="w-300px" placeholder="路由路径"/>
        </el-form-item>
         <el-form-item label="组件" prop="component" :rules="formRules.isNull('组件不能为空')">
            <el-input v-model="subForm.component" class="w-300px" placeholder="组件"/>
        </el-form-item>
         <el-form-item label="element的icon图标" prop="elSvgIcon" :rules="formRules.isNull('element的icon图标不能为空')">
            <el-input v-model="subForm.elSvgIcon" class="w-300px" placeholder="element的icon图标"/>
        </el-form-item>
         <el-form-item label="自定义的svg图标" prop="icon" :rules="formRules.isNull('自定义的svg图标不能为空')">
            <el-input v-model="subForm.icon" class="w-300px" placeholder="自定义的svg图标"/>
        </el-form-item>
         <el-form-item label="权限介绍" prop="intro" :rules="formRules.isNull('权限介绍不能为空')">
            <el-input v-model="subForm.intro" class="w-300px" placeholder="权限介绍"/>
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
            url: '/basis-func/permission/selectById',
            data: { id },
            method: 'get'
        })
    }
onMounted(()=>{
            plateFormIdReq()
            parentIdReq()
})
        let plateFormIdData = $ref([])
        const plateFormIdReq = () => {
        let reqConfig = {
        url: '/basis-func/plateForm/selectPage',
        method: 'get',
        }
        axiosReq(reqConfig).then(({data}) => {
            plateFormIdData = data.records
        })}
        let parentIdData = $ref([])
        const parentIdReq = () => {
        let reqConfig = {
        url: '/basis-func/permission/selectPage',
        method: 'get',
        }
        axiosReq(reqConfig).then(({data}) => {
            parentIdData = data.records
        })}
    /*新增和更新*/
    let subForm = reactive({
id: '',
        name:"",
        category:"",
        code:"",
        plateFormId:"",
        title:"",
        parentId:"",
        redirect:"",
        path:"",
        component:"",
        elSvgIcon:"",
        icon:"",
        intro:"",
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
            url: '/basis-func/permission/insert',
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
            url: '/basis-func/permission/updateById',
            data: subForm,
            method: 'put',
            bfLoading: true
        }).then(() => {
            elMessage('更新成功')
            routerBack()
        })
    }
    /*4.上传文件*/

    const { reshowData, fileUpload, chooseFileName, handleCancel,formRules } = useForm(subForm)
</script>

<style scoped lang="scss">

</style>
