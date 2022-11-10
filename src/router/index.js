import { createRouter, createWebHashHistory } from 'vue-router'
//公共结构（组件）：
import Layout from '@/components/Layout.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      alias: '/',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      // 任何人都可以到达登录页面(不需要登录)
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/goods',
      name: 'Goods',
      //Layout内存在侧边栏和顶部边框
      component: Layout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'category',
          name: 'GoodsCategory',
          component: () => import('@/views/Goods/Category.vue'),
        },
        {
          path: 'release',
          name: 'GoodsRelease',
          component: () => import('@/views/Goods/Release.vue'),
        },
        {
          path: 'list',
          name: 'GoodsList',
          component: () => import('@/views/Goods/List.vue'),
        },
        {
          path: 'goodsedit/:id',
          name: 'GoodsGoodsEdit',
          component: () => import('@/views/Goods/GoodsEdit.vue'),
        },
      ]
    },

    {
      path: '/order',
      name: 'Order',
      component: Layout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'list',
          name: 'OrderList',
          component: () => import('@/views/Order/List.vue'),
        },
      ]
    },

    {
      path: '/user',
      name: 'User',
      component: Layout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'list',
          name: 'UserList',
          component: () => import('@/views/User/List.vue'),
        },
        {
          path: 'info',
          name: 'UserInfo',
          component: () => import('@/views/User/Info.vue'),
        },
      ]
    },

    {
      path: '/auth',
      name: 'Auth',
      component: Layout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'role',
          name: 'AuthRole',
          component: () => import('@/views/Auth/Role.vue'),
        },
        {
          path: 'menu',
          name: 'AuthMenu',
          component: () => import('@/views/Auth/Menu.vue'),
        },
      ]
    },

  ]
})

//全局前置守卫
router.beforeEach((to, from) => {
  // console.log('to', to);
  // console.log('from', from);
  //路由元信息：判断是否需要登录验证
  if (!to.meta.requiresAuth) {
    return true;
  }
  //提取 token 进行校验————进行判断
  let token = sessionStorage.token;
  if (token) {
    //token 存在————放行

  } else {
    //token 不存在
    //返回 false 取消导航（白屏————不合理）
    //  return false;
    //将用户 重定向（redirect） 到 登录页面  
    return { name: 'Login', query: { redirect: to.fullPath } };
  }
});


export default router
