<!--
 * @Author: shlw@toplion.com.cn shlw@toplion.com.cn
 * @Date: 2021-08-16 16:58:08
 * @LastEditors: shlw@toplion.com.cn shlw@toplion.com.cn
 * @LastEditTime: 2022-10-02 22:09:10
 * @FilePath: /farbound/src/App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  provide() {
    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reload: this.reload
    };
  },
  created() {
    let a = localStorage.getItem("user");
    if (!a) {
      this.$router.push("/login");
    }
  },
  data() {
    return {
      isRouterAlive: true //控制视图是否显示的变量
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false; //先关闭，
      this.$nextTick(function() {
        this.isRouterAlive = true; //再打开
      });
    }
  }
};
</script>

<style lang="less">
html,
body,
#app {
  width: 100%;
  height: 100%;
}

.el-tab-pane,
.el-table tr {
  background-color: @boxBgColor;
}
</style>
