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
      },
      {
        path: 'query',
        name: 'MybatisPlusMulti',
        component: () => import('@/views/mybatis-plus-multi'),
        meta: { title: '多表生成' }
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
    path: '/permission-center',
    component: Layout,
    meta: { title: '菜单按钮配置中心', elSvgIcon: 'Fold' },
    alwaysShow: true,
    children: [
      {
        path: 'user-table-query',
        component: () => import('@/views/permission-center/user/UserTableQuery.vue'),
        name: 'UserTableQuery',
        meta: { title: '用户列表' }
      },
      {
        path: 'user-add-edit',
        component: () => import('@/views/permission-center/user/UserAddEdit.vue'),
        name: 'UserAddEdit',
        hidden: true,
        meta: { title: '用户列表-新增编辑', activeMenu: '/permission-center/user-table-query' }
      },
      {
        path: 'role-table-query',
        component: () => import('@/views/permission-center/role/RoleTableQuery.vue'),
        name: 'RoleTableQuery',
        meta: { title: '角色列表' }
      },
      {
        path: 'role-add-edit',
        component: () => import('@/views/permission-center/role/RoleAddEdit.vue'),
        name: 'RoleAddEdit',
        hidden: true,
        meta: { title: '角色列表-新增编辑', activeMenu: '/permission-center/role-table-query' }
      },
      {
        path: 'permission-table-query',
        component: () => import('@/views/permission-center/permission/PermissionTableQuery.vue'),
        name: 'PermissionTableQuery',
        meta: { title: '菜单权限' }
      },
      {
        path: 'permission-add-edit',
        component: () => import('@/views/permission-center/permission/PermissionAddEdit.vue'),
        name: 'PermissionAddEdit',
        hidden: true,
        meta: { title: '菜单权限-新增编辑', activeMenu: '/permission-center/permission-table-query' }
      },
      {
        path: 'plateForm-table-query',
        component: () => import('@/views/permission-center/plateForm/PlateFormTableQuery.vue'),
        name: 'PlateFormTableQuery',
        meta: { title: '平台列表' }
      },
      {
        path: 'plateForm-add-edit',
        component: () => import('@/views/permission-center/plateForm/PlateFormAddEdit.vue'),
        name: 'PlateFormAddEdit',
        hidden: true,
        meta: { title: '新增编辑', activeMenu: '/permission-center/plateForm-table-query' }
      }
    ]
  },

  // {
  //   path: '/permission-test',
  //   component: Layout,
  //   meta: { title: '权限测试Demo', elSvgIcon: 'Fold' },
  //   alwaysShow: true,
  //   children: [
  //     {
  //       path: 'test-table-query',
  //       component: () => import('@/views/permission-center/test/TestTableQuery.vue'),
  //       name: 'TestTableQuery',
  //       meta: { title: '权限测试' }
  //     },
  //     {
  //       path: 'test-add-edit',
  //       component: () => import('@/views/permission-center/test/TestAddEdit.vue'),
  //       name: 'TestAddEdit',
  //       hidden: true,
  //       meta: { title: '新增编辑', activeMenu: '/permission-center/test-table-query' }
  //     }
  //   ]
  // },

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
      },
      {
        path: 'configSave-table-query',
        component: () => import('@/views/template-demo/configSave/ConfigSaveTableQuery.vue'),
        name: 'ConfigSaveTableQuery',
        meta: { title: 'configSave列表' }
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
