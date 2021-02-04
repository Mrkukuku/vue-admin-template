import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
 
  {
    path: '/',
    component: Layout,
    redirect: '/user',
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/index'),
        meta: { 
          title: '人员管理', 
          icon: 'user', 
         }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
   1:"财务  2:"商务部"  3:"行政部"  4:"检测部"  5:"维保部"  6:"工程部"  7:"网络部"  8:"招投标部"
 */
export const asyncRoutes = [
  {
    path: '/home',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Home',
        component: () => import('@/views/home/index'),
        meta: { 
          title: '统计管理', 
          icon: 'home',
          roles: [2,4,5,6,7,8] 
        },
     }
    ]
  },
  {
    path: '/contract',
    component: Layout,
    redirect: '/contract/index',
    children: [
      {
        path: 'index',
        name: 'Contract',
        component: () => import('@/views/contract/index'),
        meta: { 
          title: '合同管理', 
          icon: 'contract', 
          roles: [2,4,5,6,7,8] 
         }
      },
      {
        path: 'contractchange/:id',
        name: 'Contractchange',
        component: () => import('@/views/contract/contract-change'),
        meta: { 
          title: '合同变更', 
          icon: 'contract', 
          noCache: true, activeMenu: '/contract/index'
         },
         hidden: true,
         props: true
      }
    ]
  },
  {
    path: '/collection',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Collection',
        component: () => import('@/views/collection/index'),
        meta: { 
          title: '收款管理', 
          icon: 'money', 
          roles: [2,8] 
         }
      }
    ]
  },
  {
    path: '/invoice',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Invoice',
        component: () => import('@/views/make-invoice/index'),
        meta: { 
          title: '付款管理', 
          icon: 'money',
          roles: [1]  
         }
      }
    ]
  },
  {
    path: '/unit',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Unit',
        component: () => import('@/views/unit/index'),
        meta: { 
          title: '单位管理', 
          icon: 'unit', 
         }
      }
    ]
  },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
