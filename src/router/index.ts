import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout'
import { RouterTy } from '~/router'

export const constantRoutes: RouterTy = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/Login.vue'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401.vue'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    meta: { title: 'element-plus', elSvgIcon: 'Fold' },
    alwaysShow: true,
    children: [
      {
        path: 'index',
        name: 'ElementPlusIndex',
        component: () => import('@/views/element-plus/index'),
        meta: { title: '表格查询生成' }
      },
      {
        path: 'add-edit',
        name: 'ElementPlusAddEdit',
        component: () => import('@/views/element-plus/add-edit'),
        meta: { title: '新增编辑生成' }
      },
      {
        path: 'detail',
        name: 'ElementPlusDetail',
        component: () => import('@/views/element-plus/detail'),
        meta: { title: '详情页生成' }
      }
    ]
  },
  {
    path: '/mybatis-plus',
    component: Layout,
    redirect: '/mybatis-plus/index',
    meta: { title: 'mybatis-plus', elSvgIcon: 'Fold' },
    alwaysShow: true,
    children: [
      {
        path: 'index',
        name: 'MybatisPlus',
        component: () => import('@/views/mybatis-plus'),
        meta: { title: '基础生成' }
      }
      // {
      //   path: 'code-generator-config',
      //   name: 'CodeGeneratorConfig',
      //   component: () => import('@/views/code-generator/code-generator-config'),
      //   meta: { title: 'CodeGeneratorConfig' }
      // }
    ]
  },
  {
    path: '/template-demo',
    component: Layout,
    meta: { title: '模版例子', elSvgIcon: 'Fold' },
    alwaysShow: true,
    children: [
      {
        path: 'brand-table-query',
        component: () => import('@/views/template-demo/brand/BrandTableQuery.vue'),
        name: 'BrandTableQuery',
        meta: { title: 'brand列表' }
      },
      {
        path: 'brand-add-edit',
        component: () => import('@/views/template-demo/brand/BrandAddEdit.vue'),
        name: 'BrandAddEdit',
        hidden: true,
        meta: { title: '新增编辑', activeMenu: '/template-demo/brand-table-query' }
      },
      {
        path: 'brand-detail',
        component: () => import('@/views/template-demo/brand/BrandDetail.vue'),
        name: 'BrandDetail',
        hidden: true,
        meta: { title: '详情', activeMenu: '/template-demo/brand-table-query' }
      }
    ]
  }
]
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes: RouterTy = [
  // 404 page must be placed at the end !!!
  // using pathMatch install of "*" in vue-router 4.0
  { path: '/:pathMatch(.*)', redirect: '/404', hidden: true }
]

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: constantRoutes
})

export default router
