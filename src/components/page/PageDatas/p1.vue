<!--
 * @Author: shlw@toplion.com.cn shlw@toplion.com.cn
 * @Date: 2022-09-28 19:57:35
 * @LastEditors: shlw@toplion.com.cn shlw@toplion.com.cn
 * @LastEditTime: 2022-09-28 23:35:46
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
        <div class="title color">设备类型统计</div>
        <div class="bottomWrapper" id="deviceTypeData"></div>
      </div>
    </div>
    <div class="wrapper2 areaStyle">
      <div class="intoGid">
        <div class="title color">设备总数</div>
      </div>
      <div class="intoGid">
        <div class="title color">报警统计</div>
        <div class="bottomWrapper" id="alarmData"></div>
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
import * as echarts from "echarts";
export default {
  data() {
    return {
      height: 0,
      // https://www.makeapie.cn/echarts_content/xvh81yeAKa.html
      deviceTypeData: {
        xData: ["防外破监测", "视频监测", "图像检测", "布控球"],
        yData: [12, 1230, 425, 232]
      },
      // https://www.makeapie.cn/echarts_content/x0oZWoncE.html
      alarmData: {
        yData: [5000, 2600, 1300, 1300, 1250, 1500],
        xData: [
          "制造业",
          "建筑业",
          "农林牧渔",
          "房地产",
          "金融业",
          "居民服务及其他"
        ]
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      // 设备类型统计-init
      this.initdeviceType();
      // 报警统计-init
      this.initAlarm();
    });
  },
  methods: {
    // 报警统计-init
    initAlarm() {
      var myChart = echarts.init(document.getElementById("alarmData"));
      myChart.setOption(this.getAlarmOption());
    },
    // 报警统计-option
    getAlarmOption() {
      return {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          top: "15%",
          right: "3%",
          left: "5%",
          bottom: "12%"
        },
        xAxis: [
          {
            type: "category",
            data: this.alarmData.xData,
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.12)"
              }
            },
            axisLabel: {
              margin: 10,
              color: "#e2e9ff",
              textStyle: {
                fontSize: 14
              }
            }
          }
        ],
        yAxis: [
          {
            axisLine: {
              show: false,
              lineStyle: {
                color: "rgba(255,255,255,1)"
              }
            },
            splitLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.12)"
              }
            }
          }
        ],
        series: [
          {
            type: "bar",
            data: this.alarmData.yData,
            barWidth: "10px",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(0,244,255,1)" // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(0,77,167,1)" // 100% 处的颜色
                    }
                  ],
                  false
                ),
                barBorderRadius: [30, 30, 30, 30],
                shadowColor: "rgba(0,160,221,1)",
                shadowBlur: 4
              }
            }
          }
        ]
      };
    },
    // 设备类型统计-init
    initdeviceType() {
      var myChart = echarts.init(document.getElementById("deviceTypeData"));
      myChart.setOption(this.getdeviceTypeOption());
    },
    // 设备类型统计-option
    getdeviceTypeOption() {
      return {
        grid: {
          top: "25%",
          left: "-5%",
          bottom: "5%",
          right: "5%",
          containLabel: true
        },
        tooltip: {
          show: true
        },
        animation: false,
        xAxis: [
          {
            type: "category",
            data: this.deviceTypeData.xData,
            axisTick: {
              alignWithLabel: true
            },
            nameTextStyle: {
              color: "#82b0ec"
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#82b0ec"
              }
            },
            axisLabel: {
              textStyle: {
                color: "#fff"
              },
              margin: 30
            }
          }
        ],
        yAxis: [
          {
            show: false,
            type: "value",
            axisLabel: {
              textStyle: {
                color: "#fff"
              }
            },
            splitLine: {
              lineStyle: {
                color: "#0c2c5a"
              }
            },
            axisLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "",
            type: "pictorialBar",
            symbolSize: [40, 10],
            symbolOffset: [0, -6], // 上部椭圆
            symbolPosition: "end",
            z: 12,
            // "barWidth": "0",
            label: {
              normal: {
                show: true,
                position: "top",
                // "formatter": "{c}%"
                fontSize: 15,
                fontWeight: "bold",
                color: "#34DCFF"
              }
            },
            color: "#2DB1EF",
            data: this.deviceTypeData.yData
          },
          {
            name: "",
            type: "pictorialBar",
            symbolSize: [40, 10],
            symbolOffset: [0, 7], // 下部椭圆
            // "barWidth": "20",
            z: 12,
            color: "#2DB1EF",
            data: this.deviceTypeData.yData
          },
          {
            name: "",
            type: "pictorialBar",
            symbolSize: function(d) {
              return d > 0 ? [50, 15] : [0, 0];
            },
            symbolOffset: [0, 12], // 下部内环
            z: 10,
            itemStyle: {
              normal: {
                color: "transparent",
                borderColor: "#2EA9E5",
                borderType: "solid",
                borderWidth: 1
              }
            },
            data: this.deviceTypeData.yData
          },
          {
            name: "",
            type: "pictorialBar",
            symbolSize: [70, 20],
            symbolOffset: [0, 18], // 下部外环
            z: 10,
            itemStyle: {
              normal: {
                color: "transparent",
                borderColor: "#19465D",
                borderType: "solid",
                borderWidth: 2
              }
            },
            data: this.deviceTypeData.yData
          },
          {
            type: "bar",
            //silent: true,
            barWidth: "40",
            barGap: "10%", // Make series be overlap
            barCateGoryGap: "10%",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 0.7, [
                  {
                    offset: 0,
                    color: "#38B2E6"
                  },
                  {
                    offset: 1,
                    color: "#0B3147"
                  }
                ]),
                opacity: 0.8
              }
            },
            data: this.deviceTypeData.yData
          }
        ]
      };
    }
  }
};
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
    flex-direction: unset !important;
    justify-content: space-between;
    align-content: center;
  }
  .color {
    color: #0dfcff;
  }
  .bottomWrapper {
    width: 100%;
    height: calc(100% - 6vh);
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
      display: flex;
      flex-direction: column;
      justify-content: space-between;
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
