<template>
  <div class="scroll-y">
    <div class="mt-10px mb-10px font-bold" v-lang>switch theme</div>
    <el-button @click="setTheme('base-theme')">base-theme(default)</el-button>
    <el-button @click="setTheme('lighting-theme')">lighting-theme</el-button>
    <el-button @click="setTheme('china-red')">china-red(default)</el-button>
    <el-button @click="setTheme('dark')">dark-theme</el-button>

    <div class="mt-10px mb-10px font-bold" v-lang>switch size</div>
    <el-button @click="setSize('large')">large</el-button>
    <el-button @click="setSize('default')">default</el-button>
    <el-button @click="setSize('small')">small</el-button>

    <div class="mt-10px mb-10px font-bold" v-lang>switch language</div>
    <el-button @click="setLanguage('en')">en</el-button>
    <el-button @click="setLanguage('zh')">zh</el-button>

    <!--example components -->
    <div class="mb-10px font-bold mt-20px" v-lang>Button Group</div>
    <el-button type="primary" @click="count++">count is: {{ count }}</el-button>
    <el-button type="success" @click="count++">count is: {{ count }}</el-button>
    <el-button type="warning" @click="count++">count is: {{ count }}</el-button>
    <el-button type="danger" @click="count++">count is: {{ count }}</el-button>
    <el-button type="info" @click="count++">count is: {{ count }}</el-button>

    <div class="mt-30px font-bold mb-10px" v-lang>unocss using</div>
    <div class="mb-40px w-900px h-10px text-16px">
      <div>
        you can look
        <el-link class="text-red" href="https://uno.antfu.me/" target="_blank">https://uno.antfu.me/</el-link>
        to search you need such as "margin-left:10px" and then get the sortcut(ml-10px)
      </div>
    </div>

    <div class="mt-30px font-bold mb-10px" v-lang>global var</div>
    {{ showObj }}
  </div>
</template>
<script setup lang="ts">
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }
]
import { ref } from 'vue'
import { useConfigStore } from '@/store/config'
const { setTheme, theme, setSize, size, setLanguage, language } = useConfigStore()
setTheme(theme)
setSize(size)
setLanguage(language)
const count = ref(0)
const showObj = ref(GLOBAL_VAR)
</script>
