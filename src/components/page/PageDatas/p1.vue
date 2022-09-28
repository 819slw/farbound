<!--
 * @Author: shlw@toplion.com.cn shlw@toplion.com.cn
 * @Date: 2022-09-28 19:57:35
 * @LastEditors: shlw@toplion.com.cn shlw@toplion.com.cn
 * @LastEditTime: 2022-09-28 22:45:15
 * @FilePath: /farbound/src/components/page/PageDatas/p1.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="pageCOntainer">
    <div class="header color">
      智慧线路管控平台
    </div>

    <!-- 地图 -->
    <div class="mapArea">

    </div>

    <div class="wrapper1 areaStyle">
      <div class="intoGid flexx">
        <div class="btnBoxGrid">
          <div class="btnBox bb1 color">最新图片</div>
        </div>
        <div class="btnBoxGrid">
          <div class="btnBox bb2">实时视频</div>
        </div>
      </div>
      <div class="intoGid">
        <div class="title color">报警统计</div>
      </div>
    </div>
    <div class="wrapper2 areaStyle">
      <div class="intoGid">
        <div class="title color">设备总数</div>
      </div>
      <div class="intoGid">
        <div class="title color">设备类型统计</div>
      </div>
    </div>
    <div class="wrapper3 areaStyle">
      <div class="intoGid">
        <div class="title color">设备在线状态</div>
      </div>
      <div class="intoGid">
        <div class="title color">更多报警</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.pageCOntainer {
  width: 100vw;
  height: 100vh;
  background: url("../../../assets/page1/bk.jpg") no-repeat;
  background-size: 100% 100%;
  z-index: -1;
  position: relative;
  .flexx {
    display: flex;
    justify-content: space-between;
    align-content: center;
  }
  .color {
    color: #0dfcff;
  }
  .btnBoxGrid {
    width: 48%;
    .bb2 {
      background: url("../../../assets/page1/box2.png");
      color: #fff;
    }
    .bb1 {
      background: url("../../../assets/page1/box1.png");
    }
    .btnBox {
      height: 4vh;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 1.8vh;
    }
  }

  .title {
    background-size: 100% 100%;
    background-position-y: 2vh;
    height: 4vh;
    font-size: 2.5vh;
    font-weight: bold;
    position: relative;
    &::after {
      content: " ";
      position: absolute;
      left: 0;
      right: 0;
      background: url("../../../assets/page1/subtitle_bk.svg") no-repeat;
      height: 2vh;
      display: inline-block;
      bottom: -2vh;
    }
  }
  .mapArea {
    position: fixed;
    top: 10vh;
    left: 25vw;
    height: 90vh;
    width: 50vw;
  }
  .areaStyle {
    height: 30vh;
    width: 100vw;
    display: flex;
    justify-content: space-between;
    .intoGid {
      width: 25vw;
      height: 100%;
      // background: url("../../../assets/page1/gif.gif");
    }
  }
  .header {
    height: 10vh;
    width: 100%;
    background: url("../../../assets/page1/title_bk.svg") no-repeat;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 5vh;
    font-weight: bold;
    padding-top: 2vh;
    box-sizing: border-box;
  }
}
</style>
