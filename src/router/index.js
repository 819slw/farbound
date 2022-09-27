import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);
const a = Router.prototype.push;
export default new Router({
  mode: "hash",
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/',
      component: () => import('../components/common/Base.vue'),
      meta: {
        title: '公共部分'
      },
      children: [
        {
          path: '/index',
          component: () => import('../components/page/My/User.vue'),
          meta: {
            title: '首页'
          }
        },
        {
          path: '/device',
          component: () => import('../components/page/device/device.vue'),
          meta: {
            title: '设备'
          }
        },
        {
          path: '/part',
          component: () => import('../components/page/My/part.vue'),
          meta: {
            title: '部门'
          }
        },
        {
          path: '/lunxun1',
          component: () => import('../components/page/device/lunxun.vue'),
          meta: {
            title: '轮询播放'
          }
        },
      ]
    },
    {
      path: '/login',
      component: () => import('../components/page/Login.vue')
    },
    {
      path: '/error',
      component: () => import('../components/page/Error.vue')
    },
    {
      path: '/404',
      component: () => import('../components/page/404.vue')
    }
  ]
})
