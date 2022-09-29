<!--
 * @Author: shlw@toplion.com.cn shlw@toplion.com.cn
 * @Date: 2022-09-29 22:56:19
 * @LastEditors: shlw@toplion.com.cn shlw@toplion.com.cn
 * @LastEditTime: 2022-09-29 23:19:24
 * @FilePath: /farbound/src/components/page/PageDatas/img.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="imgContainer">
    <div class="header">
      <i @click="back" class="el-icon-arrow-left icon"></i>
      <div>实时视频</div>
    </div>
    <div class="mainWrapper">
      <div class="leftArea"></div>
      <div class="rightArea"></div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.imgContainer {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #1867c0;
  background: url("../../../assets/page1/bg_img.jpg");
  background-size: 100% 100%;
  .mainWrapper {
    flex: 1;
    width: 100%;
    display: flex;
    .leftArea {
      height: 100%;
      border-right: 1px solid #fff;
      width: 20%;
    }
    .rightArea {
      flex: 1;
    }
  }
  .header {
    display: flex;
    align-items: center;
    height: 60px;
    border-bottom: 1px solid #fff;
    width: 100%;
    color: #fff;
    font-weight: bold;
    .icon {
      font-size: 20px;
      padding: 10px;
      font-weight: bold;
    }
  }
}
</style>
