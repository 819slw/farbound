<!--
 * @Author: shlw@toplion.com.cn shlw@toplion.com.cn
 * @Date: 2022-09-28 19:57:35
 * @LastEditors: shlw@toplion.com.cn shlw@toplion.com.cn
 * @LastEditTime: 2022-10-02 18:05:44
 * @FilePath: /farbound/src/components/page/PageDatas/p1.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="pageCOntainer">
    <div class="header color">
      智慧线路管控平台
    </div>

    <div class="backarrow" @click="backarrow">
      >
    </div>

    <!-- 地图 -->
    <div class="mapArea">
      <div class="selectArea">
        <el-select v-model="partVal" placeholder="所有部门">
          <el-option
            v-for="item in partArr"
            :key="item.depart_id"
            :label="item.depart_name"
            :value="item.depart_id">
          </el-option>
        </el-select>
        <el-select v-model="levelVal" placeholder="所有电压等级">
          <el-option
            v-for="item in levelArr"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <el-select v-model="deviceVal" placeholder="所有设备">
          <el-option
            v-for="item in deviceArr"
            :key="item.deviceSerial"
            :label="item.deviceName"
            :value="item.deviceSerial">
          </el-option>
        </el-select>
      </div>
      <div class="mapInit" id="mapInit"></div>
    </div>

    <div class="wrapper1 areaStyle">
      <div class="intoGid">
        <div class="title flexx">
          <div class="btnBoxGrid">
          <div class="btnBox bb1 color" @click="imgInto">
          <img :src="require('../../../assets/icons/duosucai.svg')" alt="">
            最新图片</div>
        </div>
        <div class="btnBoxGrid">
          <div class="btnBox bb2" @click="videoInto">
          <img :src="require('../../../assets/icons/shipin.svg')" alt="">
            实时视频</div>
        </div>
        </div>
        <div class="bottomWrapper">
          <el-carousel v-if="height" :height="height + 'px'" indicator-position="none">
            <el-carousel-item v-for="item in logImgs0" :key="item.id">
              <div class="swiperBox">
                <img :src="item.detail[0].pic_url" />
                <p class="time">时间:{{ item.create_at }}</p>
                <p class="time">设备:{{ item.deviceName }}</p>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <div class="intoGid">
        <div class="title color">
          <img :src="require('../../../assets/icons/type.svg')" alt="">
          设备类型统计</div>
        <div class="bottomWrapper" id="deviceTypeData"></div>
      </div>
    </div>
    <div class="wrapper2 areaStyle">
      <div class="intoGid">
        <div class="title color">
          <img :src="require('../../../assets/icons/suanfazongshu.svg')" alt="">

          设备总数</div>
        <div class="bottomWrapper" id="deviceTotal"></div>
      </div>
      <div class="intoGid">
        <div class="title color">
          <img :src="require('../../../assets/icons/baojing.svg')" alt="">

          报警统计</div>
        <div class="bottomWrapper" id="alarmData"></div>
      </div>
    </div>
    <div class="wrapper3 areaStyle">
      <div class="intoGid">
        <div class="title color">
          <img :src="require('../../../assets/icons/zhuangtai.svg')" alt="">

          设备在线状态</div>
        <div class="bottomWrapper" id="deviceStatus"></div>
      </div>
      <div class="intoGid">
        <div class="title color" @click="moreAlarm">
          <img :src="require('../../../assets/icons/xinxi.svg')" alt="">
          更多报警</div>
        <div class="bottomWrapper">
          <el-carousel v-if="height" :height="height + 'px'" indicator-position="none">
            <el-carousel-item v-for="item in logImgs1" :key="item.id">
              <div class="swiperBox">
                <img :src="item.detail[0].pic_url" />
                <p class="time">时间:{{ item.create_at }}</p>
                <p class="time">设备:{{ item.deviceName }}</p>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible1"
      width="50%">

      <div slot="title" class="dialog-title">
        <span class="titleType">{{ mapPoint.deviceName }}</span>
        <el-button @click="goDetail">查看详情</el-button>
      </div>

    <div class="imgListDialog">
      <div class="backPlayerEntity" id="backPlayerEntity"></div>
    </div>
    </el-dialog>


  </div>
</template>

<script>
import * as echarts from "echarts";
import EZUIKit from "ezuikit-js";

import { reqDeviceList, getLogList, reqDepartList } from "@/api/index";
export default {
  data() {
    return {
      dialogVisible1: false,
      mapPoint: {},
      height: 0,
      partArr: [],
      levelArr: ["750kV", "500kV", "330kV", "220kV", "110kV35kV", "10kV"],
      deviceArr: [],
      partVal: "",
      levelVal: "",
      deviceVal: "",
      logImgs0: [],
      userInfo: {},
      logImgs1: [],
      BillboardObject: null,
      // 设备类型统计: https://www.makeapie.cn/echarts_content/xvh81yeAKa.html
      deviceTypeData: {
        xData: ["防外破监测", "视频监测", "图像检测", "布控球"],
        yData: [12, 1230, 425, 232]
      },
      //报警统计: https://www.makeapie.cn/echarts_content/x0oZWoncE.html
      alarmData: {
        yData: [5000, 2600, 1300, 1300, 1250, 1250, 1500],
        xData: [
          "吊车",
          "塔吊",
          "挖掘机",
          "工程车",
          "人员入侵检测",
          "异物悬挂",
          "烟火识别"
        ]
      },
      deviceTotal: [
        {
          value: 91,
          name: "综合健康评分"
        }
      ],
      deviceStatusData: {
        data: [
          {
            name: "在线",
            value: 40
          },
          {
            name: "离线",
            value: 80
          }
        ]
      }
    };
  },
  watch: {
    partVal(o) {
      this.initDeviceList(o);
    }
  },
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem("user"));
    console.log(this.userInfo);
    this.$nextTick(() => {
      this.initHieght();
      // 设备类型统计-init
      this.initdeviceType();
      // 报警统计-init
      this.initAlarm();
      // 初始化地图
      this.initMap();

      // 初始化swiper 0 + 1
      this.initLogList0();
      this.initLogList1();
      this.initAllDepart();
    });
  },
  methods: {
    backarrow() {
      this.$router.push("/index");
    },
    moreAlarm() {
      this.$router.push("/alarmImg");
    },
    videoInto() {
      this.$router.push("/video");
    },
    imgInto() {
      this.$router.push("/img");
    },
    initLogList0() {
      getLogList({
        depart_id: this.userInfo.depart_id,
        page: 1,
        pageSize: 10,
        push_type: 0
      }).then(res => {
        this.logImgs0 = res.data.list;
      });
    },
    initLogList1() {
      getLogList({
        depart_id: this.userInfo.depart_id,
        page: 1,
        pageSize: 10,
        push_type: 1
      }).then(res => {
        this.logImgs1 = res.data.list;
      });
    },
    initDeviceList(id) {
      reqDeviceList({
        depart_id: id || this.userInfo.depart_id
      }).then(res => {
        this.deviceArr = res.data;
        let arr = res.data;
        this.deviceStatusData.data[0].value = arr.filter(
          v => v.status == 1
        ).length;
        this.deviceStatusData.data[1].value = arr.filter(
          v => v.status != 1
        ).length;

        // 设备在线状态 - init
        this.initDeviceStatus();

        this.deviceTotal[0].value = arr.length;
        // 设备总数
        this.initDeviceTotal();

        // 初始化所有标注点
        this.initAllPoint();
      });
    },
    initAllPoint() {
      this.deviceArr.forEach(v => {
        // this.BillboardObject
        let entity = new YJ.Obj.BillboardObject({
          id: v.deviceSerial,
          position: {
            lng: v.lng,
            lat: v.lat,
            alt: 0
          },
          billboard: {
            image: require("../../../assets/page1/location_fill.png")
          },
          scaleByDistance: false,
          label: {
            text: v.deviceName,
            color: "#fff"
          }
        });
        entity.onClick = (e, id) => {
          // this.dialogVisible1 = true;
          let obj = this.deviceArr.find(v => v.deviceSerial == id);
          this.mapPoint = obj;
          this.goDetail();
          // this.$nextTick(() => {
          //   let dom = document.querySelector("#backPlayerEntity");
          //   let width = dom.offsetWidth;
          //   let height = dom.offsetHeight;
          //   let entity1 = new EZUIKit.EZUIKitPlayer({
          //     id: "backPlayerEntity", // 视频容器ID
          //     accessToken: this.token,
          //     template: "2ccb62e662de445d9d67e5f0e57af6e1",
          //     url: "ezopen://open.ys7.com/" + obj.deviceSerial + "/1.hd.live",
          //     height,
          //     width
          //   });
          // });

          entity.flyTo();
        };
      });
    },
    goDetail() {
      let item = this.mapPoint;
      this.$router.push(
        `/deviceDetail?deviceName=${item.deviceName}&deviceSerial=${
          item.deviceSerial
        }&lat=${item.lat}&lng=${item.lng}`
      );
    },
    // 初始化高度
    initHieght() {
      let dom = document.querySelector(".bottomWrapper");
      this.height = dom.offsetHeight - 10;
    },
    initAllDepart() {
      reqDepartList({
        depart_id: this.userInfo.depart_id
      }).then(res => {
        this.partArr = res.data;
      });
    },
    // 初始化地图
    initMap() {
      // mapInit
      YJ.on().then(() => {
        new YJ.YJEarth("mapInit");
        new YJ.Layer.GDWXImagery();
        new YJ.Layer.GDLWImagery();
        //所有关于地球的操作  都需要在这后面进行
        // 接口 设备列表
        this.initDeviceList();
      });
    },
    // 设备总数 - init
    initDeviceTotal() {
      var myChart = echarts.init(document.getElementById("deviceTotal"));
      myChart.setOption(this.getDeviceTotal());
    },
    // 设备总数 - option
    getDeviceTotal() {
      var color = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        {
          offset: 0,
          color: "#5CF9FE" // 0% 处的颜色
        },
        {
          offset: 0.17,
          color: "#468EFD" // 100% 处的颜色
        },
        {
          offset: 0.9,
          color: "#468EFD" // 100% 处的颜色
        },
        {
          offset: 1,
          color: "#5CF9FE" // 100% 处的颜色
        }
      ]);
      var colorSet = [[0.91, color], [1, "#15337C"]];
      var rich = {
        white: {
          fontSize: 20,
          color: "#fff",
          fontWeight: "500",
          padding: [-150, 0, 0, 0]
        },
        bule: {
          fontSize: 50,
          fontFamily: "DINBold",
          color: "#fff",
          fontWeight: "700",
          padding: [-120, 0, 0, 0]
        },
        radius: {
          width: 350,
          height: 80,
          // lineHeight:80,
          borderWidth: 1,
          borderColor: "#0092F2",
          fontSize: 20,
          color: "#fff",
          backgroundColor: "#1B215B",
          borderRadius: 20,
          textAlign: "center"
        },
        size: {
          height: 400,
          padding: [100, 0, 0, 0]
        }
      };
      let option = {
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%"
        },

        series: [
          {
            //内圆
            type: "pie",
            radius: "85%",
            center: ["50%", "50%"],
            z: 0,
            itemStyle: {
              normal: {
                color: new echarts.graphic.RadialGradient(
                  0.5,
                  0.5,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(17,24,43,0)"
                    },
                    {
                      offset: 0.5,
                      // color: '#1E2B57'
                      color: "rgba(28,42,91,.6)"
                    },
                    {
                      offset: 1,
                      color: "#141C33"
                      // color:'rgba(17,24,43,0)'
                    }
                  ],
                  false
                ),
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            hoverAnimation: false,
            label: {
              show: false
            },
            tooltip: {
              show: false
            },
            data: [100]
          },
          {
            type: "gauge",
            name: "外层辅助",
            radius: "74%",
            startAngle: "225",
            endAngle: "-45",
            splitNumber: "100",
            pointer: {
              show: false
            },
            detail: {
              show: false
            },
            data: [
              {
                value: 1
              }
            ],
            // data: [{value: 1, name: 90}],
            title: {
              show: true,
              offsetCenter: [0, 30],
              textStyle: {
                color: "#fff",
                fontStyle: "normal",
                fontWeight: "normal",
                fontFamily: "微软雅黑",
                fontSize: 20
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: [[1, "#00FFFF"]],
                width: 2,
                opacity: 1
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              length: 20,
              lineStyle: {
                color: "#051932",
                width: 0,
                type: "solid"
              }
            },
            axisLabel: {
              show: false
            }
          },
          {
            type: "gauge",
            radius: "70%",
            startAngle: "225",
            endAngle: "-45",
            pointer: {
              show: false
            },
            detail: {
              formatter: function(value) {
                var num = Math.round(value);
                return (
                  "{bule|" +
                  num +
                  "}{white|个}" +
                  "{size|" +
                  "}\n{radius|综合健康评分}"
                );
              },
              rich: rich,
              offsetCenter: ["0%", "0%"]
            },
            data: this.deviceTotal,
            title: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: colorSet,
                width: 25,
                // shadowBlur: 15,
                // shadowColor: '#B0C4DE',
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                opacity: 1
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false,
              length: 25,
              lineStyle: {
                color: "#00377a",
                width: 2,
                type: "solid"
              }
            },
            axisLabel: {
              show: false
            }
          },
          {
            name: "灰色内圈", //刻度背景
            type: "gauge",
            z: 2,
            radius: "60%",
            startAngle: "225",
            endAngle: "-45",
            //center: ["50%", "75%"], //整体的位置设置
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [[1, "#018DFF"]],
                width: 2,
                opacity: 1 //刻度背景宽度
              }
            },
            splitLine: {
              show: false
            },
            // data: [{
            //     show: false,
            //     value: '80'
            // }], //作用不清楚
            axisLabel: {
              show: false
            },
            pointer: {
              show: false
            },
            axisTick: {
              show: false
            },
            detail: {
              show: 0
            }
          },
          {
            name: "白色圈刻度",
            type: "gauge",
            radius: "60%",
            startAngle: 225, //刻度起始
            endAngle: -45, //刻度结束
            z: 4,
            axisTick: {
              show: false
            },
            splitLine: {
              length: 16, //刻度节点线长度
              lineStyle: {
                width: 2,
                color: "rgba(1,244,255, 0.9)"
              } //刻度节点线
            },
            axisLabel: {
              color: "rgba(255,255,255,0)",
              fontSize: 12
            }, //刻度节点文字颜色
            pointer: {
              show: false
            },
            axisLine: {
              lineStyle: {
                opacity: 0
              }
            },
            detail: {
              show: false
            },
            data: [
              {
                value: 0,
                name: ""
              }
            ]
          },
          {
            //内圆
            type: "pie",
            radius: "56%",
            center: ["50%", "50%"],
            z: 1,
            itemStyle: {
              normal: {
                color: new echarts.graphic.RadialGradient(
                  0.5,
                  0.5,
                  0.8,
                  [
                    {
                      offset: 0,
                      color: "#4978EC"
                    },
                    {
                      offset: 0.5,
                      color: "#1E2B57"
                    },
                    {
                      offset: 1,
                      color: "#141F3D"
                    }
                  ],
                  false
                ),
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            hoverAnimation: false,
            label: {
              show: false
            },
            tooltip: {
              show: false
            },
            data: [100]
          }
        ]
      };
      return option;
    },
    // 设备在线状态 - init
    initDeviceStatus() {
      var myChart = echarts.init(document.getElementById("deviceStatus"));
      myChart.setOption(this.getDeviceStatusData());
    },
    // 设备在线状态 - option
    getDeviceStatusData() {
      let option = {
        title: false,
        color: [
          "#00E676",
          "#F44336"
          // "#ffdb5c",
          // "#ff9f7f",
          // "#fb7293",
          // "#e7bcf3",
          // "#8378ea"
        ],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        toolbox: {
          show: false,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ["pie", "funnel"]
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        series: [
          {
            name: "增值电信业务统计表",
            type: "pie",
            radius: [40, 70],
            roseType: "area",
            data: this.deviceStatusData.data
          }
        ]
      };
      return option;
    },

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
  overflow: hidden;
  background: url("../../../assets/page1/bk.jpg") no-repeat;
  background-size: 100% 100%;
  position: relative;
  .backPlayerEntity {
    height: 50vh;
  }
  .titleType {
    color: #fff;
    font-weight: bold;
    margin-right: auto;
  }
  .backarrow {
    width: 20px;
    height: 20px;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    left: 0;
    top: 50%;
    color: #000;
    z-index: 9999;
  }

  .flexx {
    display: flex;
    flex-direction: unset !important;
    justify-content: space-between;
    align-content: center;
  }
  .color {
    color: #0dfcff;
  }
  .swiperBox {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: #38b2e6;
    border-radius: 5px;
    overflow: hidden;
    .time {
      color: #fff;
      padding: 0 10px;
      padding-top: 5px;
    }
    img {
      width: 100%;
      flex: 1;
      overflow: hidden;
    }
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
      cursor: pointer;
    }
  }

  .title {
    background-size: 100% 100%;
    background-position-y: 2vh;
    padding-left: 15px;
    height: 4vh;
    font-size: 2.5vh;
    font-weight: bold;
    position: relative;
    display: flex;
    align-items: center;
    img {
      height: 50%;
      margin-right: 15px;
    }
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
    display: flex;
    flex-direction: column;
    .mapInit {
      max-height: 90vh;
      flex: 1;
    }
    .selectArea {
      display: flex;
      justify-content: center;
      /deep/ .el-select {
        margin-left: 15px;
      }
    }
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
