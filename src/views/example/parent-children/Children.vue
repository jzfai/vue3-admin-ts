<template>
  <div>
    <div>{{ name }}</div>
    <el-button @click="emitFather">emitFather</el-button>
    <el-button @click="getFatherMethod">getFatherMethod</el-button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  fatherName: {
    require: true,
    default: '',
    type: String
  }
})
let state = reactive({
  name: 'Children'
})
//导出给refs使用
let childRef = ref('childRef')
let childMethod = () => {
  return 'childMethod'
}
const parentDom: any = parent
let getFatherMethod = () => {
  parentDom.fartherMethod()
}
//emit
// 定义emit事件
const emit = defineEmits(['emitParent'])
const emitFather = () => {
  emit('emitParent', { val: '子组件传递的信息' })
}
onMounted(() => {
  console.log('得到父元素的prop', props.fatherName)
})
defineExpose({ childRef, childMethod })
//export to page for use
let { name } = toRefs(state)
</script>

<style scoped lang="scss"></style>
