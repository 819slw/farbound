import Vue from "vue";
import App from "./App";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/assets/css/common.less";
import "@/assets/css/variable.less";
import "@/assets/css/theme/459f75/index.css";
import axios from "axios";
import echarts from "echarts";
import AMap from "vue-amap";
import bus from "vue-bus";
Vue.use(AMap);

Vue.config.productionTip = false;
Vue.use(ElementUI, { size: "medium" });
Vue.prototype.$axios = axios; // axios不能使用use
Vue.prototype.$echarts = echarts;
Vue.use(bus);
// 使用router.beforeEach注册一个全局前置守卫，对路由进行权限跳转
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requireAuth)) { // 判断该路由是否需要登录权限
//     if (localStorage.getItem('sessionid')) { // 判断当前的sessionid是否存在 ； 登录存入的sessionid
//       next();
//     } else {
//       next({
//         path: '/login',
//         query: {redirect: to.fullPath} // 将要跳转路由的path作为参数，传递到登录页面
//       })
//     }
//   } else {
//     next();
//   }
// })

let vue = new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>",
});
export default vue;
