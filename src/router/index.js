/*
 * @Author: shlw@toplion.com.cn shlw@toplion.com.cn
 * @Date: 2022-09-06 17:49:16
 * @LastEditors: shlw@toplion.com.cn shlw@toplion.com.cn
 * @LastEditTime: 2022-09-30 14:54:08
 * @FilePath: /farbound/src/router/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
const a = Router.prototype.push;
export default new Router({
  mode: "hash",
  routes: [
    {
      path: "/",
      redirect: "/fristPage"
    },
    {
      path: "/fristPage",
      component: () => import("../components/page/PageDatas/p1.vue")
    },
    {
      path: "/deviceDetail",
      component: () => import("../components/page/PageDatas/deviceDetail.vue")
    },
    {
      path: "/img",
      component: () => import("../components/page/PageDatas/img.vue")
    },
    {
      path: "/alarmImg",
      component: () => import("../components/page/PageDatas/alarmImg.vue")
    },
    {
      path: "/video",
      component: () => import("../components/page/PageDatas/video.vue")
    },
    {
      path: "/",
      component: () => import("../components/common/Base.vue"),
      meta: {
        title: "公共部分"
      },
      children: [
        {
          path: "/index",
          component: () => import("../components/page/My/User.vue"),
          meta: {
            title: "首页"
          }
        },
        {
          path: "/device",
          component: () => import("../components/page/device/device.vue"),
          meta: {
            title: "设备"
          }
        },
        {
          path: "/part",
          component: () => import("../components/page/My/part.vue"),
          meta: {
            title: "部门"
          }
        },
        {
          path: "/lunxun1",
          component: () => import("../components/page/device/lunxun.vue"),
          meta: {
            title: "轮询播放"
          }
        }
      ]
    },
    {
      path: "/login",
      component: () => import("../components/page/Login.vue")
    },
    {
      path: "/error",
      component: () => import("../components/page/Error.vue")
    },
    {
      path: "/404",
      component: () => import("../components/page/404.vue")
    }
  ]
});
