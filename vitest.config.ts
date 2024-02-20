import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import DefineOptions from 'unplugin-vue-define-options/vite'

export default defineConfig({
  // @ts-ignore
  plugins: [Vue(), VueJsx(), DefineOptions()],
  optimizeDeps: {
    disabled: true
  },
  test: {
    clearMocks: true,
    environment: 'jsdom',
    //setup 文件的路径。它们将运行在每个测试文件之前。
    setupFiles: ['./vitest.setup.ts'],
    transformMode: {
      web: [/\.[jt]sx$/]
    }
  }
})
