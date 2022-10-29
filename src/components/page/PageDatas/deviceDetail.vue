<!--
 * @Author: shlw@toplion.com.cn shlw@toplion.com.cn
 * @Date: 2022-09-29 22:56:19
 * @LastEditors: shlw@toplion.com.cn shlw@toplion.com.cn
 * @LastEditTime: 2022-10-29 13:42:22
 * @FilePath: /farbound/src/components/page/PageDatas/img.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="imgContainer">
    <div class="header">
      <i @click="back" class="el-icon-arrow-left icon"></i>
      <div>{{$route.query.deviceName}}</div>
      <div class="selectRight">
        <div class="btnBox bb1 color" @click="imgInto(1)">
          <img :src="require('../../../assets/icons/duosucai.svg')" alt="">
            定时推送</div>
        <div class="btnBox bb2" @click="imgInto(2)">
      <img :src="require('../../../assets/icons/shipin.svg')" alt="">
        报警推送</div>


        <div class="btnBox bb2" @click="imgInto(3)">
          <img :src="require('../../../assets/icons/shipin.svg')" alt="">
            回放</div>
            <div class="btnBox bb2" @click="imgInto(4)">
              <img :src="require('../../../assets/icons/shipin.svg')" alt="">
                重启</div>
      </div>
    </div>
    <div class="mainWrapper">
      <div class="lleft">
        <p class="title">定时推送</p>
        <div class="llfeftImg">

          <el-image
          :src="a.detail[0].pic_url" v-for="a in logList.slice(0,2)" :key="a.id"
          :preview-src-list="logList.map(v => v.detail[0].pic_url)">
        </el-image>
          <div class="emptyBox" v-if="logList.length == 0">
            暂无数据
            <!-- <el-empty description="暂无数据"></el-empty> -->
          </div>
        </div>
        <p class="title">告警推送</p>
        <div class="llfeftImg">

          <el-image
          :src="a.detail[0].pic_url" v-for="a in alarmList.slice(0,2)" :key="a.id"
          :preview-src-list="alarmList.map(v => v.detail[0].pic_url)">
        </el-image>
          <div class="emptyBox" v-if="alarmList.length == 0">
            暂无数据
            <!-- <el-empty description="暂无数据"></el-empty> -->
          </div>
        </div>
      </div>
      <div class="rightArea" @dblclick="dbclickHandle">
        <div class="devicename">{{ $route.query.deviceName }}</div>
        <div style="width:100%" id="deviceArea"></div>
      </div>
      <div class="leftArea">
        <p class="title">设备操控</p>
        <div class="btnList">
          <div @mousedown="onKeydown(a)" @mouseup="onKeyUp(a)" class="iconItem" v-for="(a,i) in listAll" :key="i">
            <img :src="a.icon" :style="'transform: rotate(' + a.angle + 'deg);'" alt=""/>
          </div>
        </div>
        <p class="title">预设点</p>
        <div class="addPresent">
          <div class="flex">
            <el-input v-model="presetName" placeholder="请输入要添加的预设点"></el-input>
            <el-button type="primary" @click="addPreset" style="margin-left: 16px">添加</el-button>
          </div>
          <div class="flex">
            <el-select v-model="presetVal" placeholder="请选择">
              <el-option
                v-for="item in presetList"
                :key="item.preset_index"
                :label="item.preset_name"
                :value="item.preset_index">
              </el-option>
            </el-select>
            <el-button type="primary" @click="usePreset">调用</el-button>
            <el-button type="primary" @click="delPreset">删除</el-button>

          </div>
        </div>
      </div>
    </div>


    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%">

      <div slot="title" class="dialog-title">
        <span class="titleType">{{ titleType }}</span>
        <el-date-picker
        class="pickerQi"
      v-model="value1"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
      </div>


    <div class="imgListDialog">
      <el-image
      :src="a.detail[0].pic_url" v-for="a in imgList" :key="a.id"
      :preview-src-list="imgList.map(v => v.detail[0].pic_url)">
    </el-image>
    <el-empty v-if="imgList.length == 0" description="暂无数据"></el-empty>
    </div>
    </el-dialog>


    <el-dialog
      title="提示"
      :visible.sync="dialogVisible1"
      width="50%">

      <div slot="title" class="dialog-title">
        <span class="titleType">回放</span>
        <el-date-picker
        class="pickerQi"
      v-model="callbackPlayerVal"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
      </div>


    <div class="imgListDialog">
      <div class="backPlayerEntity" id="backPlayerEntity"></div>
    <el-empty v-if="!backPlayerEntity" description="先选择时间"></el-empty>
    </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  getToken,
  reqPtzStart,
  reqPtzStop,
  presetListInterface,
  addDevicePreset,
  delDevicePreset,
  moveDevicePreset,
  getAlarmByDeviceSerialWithTime,
  getLogByDeviceSerialWithTime
} from "@/api/index";

import EZUIKit from "ezuikit-js";

export default {
  data() {
    return {
      dialogVisible1: false,
      callbackPlayerVal: null,
      backPlayer: false,
      backPlayerEntity: null,
      alarmList: [],
      logList: [],
      type: "",
      value1: [],
      titleType: "",
      imgList: [],
      dialogVisible: false,
      token: "",
      palyer: null,
      presetName: "",
      presetVal: "",
      presetList: [],
      listAll: [
        {
          id: 1,
          name: "放大",
          icon: require("../../../assets/deviceicon/amp.png"),
          direction: 8,
          angle: 0
        },
        {
          id: 2,
          name: "左上",
          icon: require("../../../assets/deviceicon/上.png"),
          direction: 4,
          angle: -45
        },
        {
          id: 3,
          name: "上",
          icon: require("../../../assets/deviceicon/上.png"),
          direction: 0
        },
        {
          id: 4,
          name: "右上",
          icon: require("../../../assets/deviceicon/上.png"),
          direction: 6,
          angle: 45
        },
        {
          id: 5,
          name: "缩小",
          icon: require("../../../assets/deviceicon/xiao.png"),
          direction: 9,
          angle: 0
        },
        {
          id: 6,
          name: "左",
          icon: require("../../../assets/deviceicon/上.png"),
          direction: 2,
          angle: -90
        },
        {
          id: 7,
          name: "对讲",
          icon: require("../../../assets/deviceicon/麦克风.png"),
          direction: 9,
          angle: 0
        },
        {
          id: 8,
          name: "右",
          icon: require("../../../assets/deviceicon/上.png"),
          direction: 3,
          angle: 90
        },
        {
          id: 9,
          name: "雨刮",
          icon: require("../../../assets/deviceicon/yugua.png"),
          direction: 0,
          angle: 0
        },
        {
          id: 10,
          name: "左下",
          icon: require("../../../assets/deviceicon/上.png"),
          direction: 5,
          angle: 225
        },
        {
          id: 11,
          name: "下",
          icon: require("../../../assets/deviceicon/上.png"),
          direction: 1,
          angle: 180
        },
        {
          id: 12,
          name: "右下",
          icon: require("../../../assets/deviceicon/上.png"),
          direction: 7,
          angle: 135
        }
      ]
    };
  },
  watch: {
    value1(o) {
      this.imgInto(this.type);
    },
    callbackPlayerVal(o) {
      this.backPlayerEntity = null;
      this.callbackPlayerHandler();
    },
    dialogVisible(o) {
      if (!o) {
        this.value1 = "";
      }
    }
  },
  async created() {
    this.userInfo = JSON.parse(localStorage.getItem("user"));
    let res = await getToken();
    this.token = res.data.token;
    this.createPlayer();
    this.initPreset();

    this.initLogList();
    this.initAlarmList();
  },
  methods: {
    setTitle(deviceName) {
      let domDiv = document.createElement("div");
      domDiv.innerText = deviceName;
      domDiv.style.position = "fixed";
      domDiv.style.top = "20px";
      domDiv.style.right = "20px";
      domDiv.style.color = "#999";
      domDiv.style.fontSize = "14px";
      domDiv.style.borderRadius = "8px";
      domDiv.style.padding = "4px 10px";
      domDiv.style.background = "#ffffff";

      this.$nextTick(() => {
        let dom = document.querySelector(`#deviceArea`);
        dom.appendChild(domDiv);
      });
    },
    dbclickHandle() {
      this.palyer.fullScreen();
      this.setTitle(this.$route.query.deviceName);
    },
    callbackPlayerHandler() {
      let dom = document.querySelector("#backPlayerEntity");
      let width = dom.offsetWidth;
      let height = dom.offsetHeight;
      this.backPlayerEntity = new EZUIKit.EZUIKitPlayer({
        id: "backPlayerEntity", // 视频容器ID
        accessToken: this.token,
        template: "2ccb62e662de445d9d67e5f0e57af6e1",
        url: `ezopen://open.ys7.com/${
          this.$route.query.deviceSerial
        }/1.hd.rec?begin=${this.dateFormat(
          new Date(this.callbackPlayerVal[0]),
          "yyyyMMddhhmmss"
        )}&end=${this.dateFormat(
          new Date(this.callbackPlayerVal[1]),
          "yyyyMMddhhmmss"
        )}`,
        height,
        width
      });
    },
    presetOtherFun(a) {},
    initPreset() {
      presetListInterface({
        deviceSerial: this.$route.query.deviceSerial
      }).then(res => {
        this.presetList = res.data;
      });
    },
    addPreset() {
      addDevicePreset({
        preset_name: this.presetName,
        deviceSerial: this.$route.query.deviceSerial
      }).then(res => {
        this.$message.success("添加成功");
        this.initPreset();
      });
    },
    usePreset(a) {
      if (typeof a == "object") {
        a = undefined;
      }
      moveDevicePreset({
        preset_index: a == 0 ? a : a || this.presetVal,
        deviceSerial: this.$route.query.deviceSerial
      }).then(res => {
        this.$message.success("调用成功");
      });
    },
    delPreset() {
      delDevicePreset({
        preset_index: this.presetVal,
        deviceSerial: this.$route.query.deviceSerial
      }).then(res => {
        this.$message.success("删除成功");
        this.presetVal = "";
        this.initPreset();
      });
    },
    onKeydown(item) {
      if (item.direction == 0 && item.name == "雨刮") {
        this.usePreset(1);
        return;
      }
      reqPtzStart({
        deviceSerial: this.$route.query.deviceSerial,
        direction: item.direction
      }).then(res => {
        if (res.code == 200 || res.code == 0) {
          if (item.id == 1 || item.id == 5 || item.id == 9) {
            this.$toast.success(res.msg);
          }
        } else {
          this.$toast.fail(res.msg);
        }
      });
    },
    onKeyUp(item) {
      if (item.direction == 0) {
        return;
      }
      reqPtzStop({
        deviceSerial: this.$route.query.deviceSerial,
        direction: item.direction
      }).then(res => {
        if (res.code == 200 || res.code == 0) {
          if (item.id == 1 || item.id == 5 || item.id == 9) {
            this.$toast.success(res.msg);
          }
        } else {
          this.$toast.fail(res.msg);
        }
      });
    },
    restart() {},
    back() {
      this.$router.go(-1);
    },
    async imgInto(type) {
      if (type == 3) {
        this.dialogVisible1 = true;
        return;
      } else if (type == 4) {
        this.usePreset(2);
        return;
      }

      this.dialogVisible = true;
      this.type = type;
      let arr = [];
      if (type == 1) {
        this.titleType = "定时推送";
        let info = await getLogByDeviceSerialWithTime({
          deviceSerial: this.$route.query.deviceSerial,
          start:
            (this.value1 &&
              this.value1[0] &&
              this.dateFormat(new Date(this.value1[0]))) ||
            this.dateFormat(new Date().getTime() - 24 * 60 * 60 * 1000),
          end:
            (this.value1 &&
              this.value1[1] &&
              this.dateFormat(new Date(this.value1[1]))) ||
            this.dateFormat(new Date().getTime())
        });
        arr = info.data.list;
      } else {
        this.titleType = "报警推送";
        let info = await getAlarmByDeviceSerialWithTime({
          deviceSerial: this.$route.query.deviceSerial,
          start: this.dateFormat(new Date().getTime() - 24 * 60 * 60 * 1000),
          end: this.dateFormat(new Date().getTime())
        });
        arr = info.data.list;
      }
      this.imgList = arr || [];
    },
    async initLogList() {
      let info = await getLogByDeviceSerialWithTime({
        deviceSerial: this.$route.query.deviceSerial,
        start: this.dateFormat(new Date().getTime() - 24 * 60 * 60 * 1000),
        end: this.dateFormat(new Date().getTime())
      });
      this.logList = info.data.list || [];
    },
    async initAlarmList() {
      let info = await getAlarmByDeviceSerialWithTime({
        deviceSerial: this.$route.query.deviceSerial,
        start: this.dateFormat(new Date().getTime() - 24 * 60 * 60 * 1000),
        end: this.dateFormat(new Date().getTime())
      });
      this.alarmList = info.data.list || [];
    },

    createPlayer() {
      let dom = document.querySelector("#deviceArea");
      let width = dom.offsetWidth;
      let height = dom.offsetHeight;
      this.palyer = new EZUIKit.EZUIKitPlayer({
        id: "deviceArea", // 视频容器ID
        accessToken: this.token,
        template: "2ccb62e662de445d9d67e5f0e57af6e1",
        url:
          "ezopen://open.ys7.com/" +
          this.$route.query.deviceSerial +
          "/1.hd.live",
        height,
        width
      });
    },
    dateFormat(date, format) {
      format = format || "yyyy-MM-dd hh:mm:ss";
      date = new Date(date);
      if (date !== "Invalid Date") {
        let o = {
          "M+": date.getMonth() + 1, //month
          "d+": date.getDate(), //day
          "h+": date.getHours(), //hour
          "m+": date.getMinutes(), //minute
          "s+": date.getSeconds(), //second
          "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
          S: date.getMilliseconds() //millisecond
        };
        if (/(y+)/.test(format))
          format = format.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
          );
        for (let k in o)
          if (new RegExp("(" + k + ")").test(format))
            format = format.replace(
              RegExp.$1,
              RegExp.$1.length === 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length)
            );
        return format;
      }
      return "";
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
  .emptyBox {
    color: #fff;
    width: 100%;
    margin-top: 50px;
    text-align: center;
  }
  .devicename {
    color: #999;
    position: absolute;
    right: 5px;
    top: 5px;
    font-size: 14px;
    padding: 4px 10px;
    background: #fff;
    border-radius: 8px;
    z-index: 9999;
  }
  .pickerQi {
    margin-right: 40px;
  }
  .titleType {
    color: #fff;
    font-weight: bold;
    margin-right: auto;
  }
  .imgListDialog {
    width: 100%;
    .backPlayerEntity {
      height: 50vh;
    }
    /deep/.el-image {
      width: 19%;
      margin-right: 1%;
      margin-bottom: 10px;
      border-radius: 8px;
    }
  }
  .flex {
    margin-bottom: 2vh;
    display: flex;
    justify-content: space-between;
  }
  .bb2 {
    background: url("../../../assets/page1/box2.png");
    color: #fff;
  }
  .bb1 {
    background: url("../../../assets/page1/box1.png");
  }
  .dialog-title {
    display: flex;
    align-items: center;
  }
  .btnBox {
    height: 4vh;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.8vh;
    padding: 0 20px;
    cursor: pointer;
    margin-left: 20px;
    img {
      height: 50%;
      margin-right: 15px;
    }
  }
  .selectRight {
    margin-left: auto;
    margin-right: 32px;
    display: flex;
  }
  .deviceList {
    color: #fff;
    height: 100%;
    overflow: auto;
    .item {
      margin-top: 16px;
      border-bottom: 1px solid #fff;
      cursor: pointer;
    }
  }
  .listDetail {
    width: 100%;
    //height: 23vh;
    margin-top: 16px;
    border: 1px solid #7fc6c8;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;

    .equipment {
      position: absolute;
      left: 10px;
      bottom: 6px;
      font-size: 12px;
      color: white;
      display: inline-block;
      padding: 0 6px;
      background-color: #38b2e6;
      border-radius: 8px;
    }

    .status {
      position: absolute;
      right: 10px;
      top: 6px;

      & > span:first-child {
        border-radius: 50%;
        width: 10px;
        height: 10px;
        display: inline-block;
      }

      & > span:last-child {
        font-size: 10px;
      }
    }

    .tools {
      position: absolute;
      bottom: 10px;
      right: 10px;

      > img {
        height: 6px;
      }
    }

    .poster {
      width: 100%;
      height: 100%;
    }

    .pausePlay {
      width: 60px;
      height: 60px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .mainWrapper {
    flex: 1;
    width: 100%;
    display: flex;
    overflow: hidden;
    .leftArea {
      height: 100%;
      border-right: 1px solid #fff;
      width: 20%;
      overflow: hidden;
      box-sizing: border-box;
      padding: 1vh;
      .btnList {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        box-sizing: border-box;
        border-top: 1px solid #fff;
        border-left: 1px solid #fff;
        margin-bottom: 2vh;
        .iconItem {
          width: 25%;
          min-width: 25%;
          padding: 20px 0;
          display: flex;
          justify-content: center;
          align-items: center;
          border-bottom: 1px solid #fff;
          border-right: 1px solid #fff;
          box-sizing: border-box;
          img {
            width: 30px;
          }
        }
      }
    }
    .commonStyle {
      box-sizing: border-box;
      border-bottom: 1px solid #fff;
      border-right: 1px solid #fff;
    }
    .foreGrid {
      width: 50%;
      height: 50%;
    }
    .sixGrid {
      width: 33%;
      height: 50%;
    }
    .nineGrid {
      width: 33%;
      height: 33%;
    }
    .flexCenter {
      display: flex;
      justify-content: center;
      align-items: center;
      .el-icon-loading {
        color: #fff;
        font-size: 50px;
        font-weight: bold;
      }
    }
    .rightArea {
      width: 60%;
      overflow: hidden;
      display: flex;
      flex-wrap: wrap;
      position: relative;
    }
    .lleft {
      width: 20%;
      height: 100%;
      box-sizing: border-box;
      padding: 1vh;
      .llfeftImg {
        display: flex;
        flex-direction: column;
        /deep/.el-image {
          width: 100%;
          margin-bottom: 16px;
          border-radius: 8px;
        }
      }
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
    position: sticky;
    z-index: 999999;
    background: #05071f;
    .icon {
      font-size: 20px;
      padding: 10px;
      font-weight: bold;
      cursor: pointer;
    }
  }
  .title {
    color: #fff;
    font-size: 2.2vh;
    font-weight: bold;
    padding-bottom: 1vh;
  }
  /deep/ .el-input__inner {
    background: transparent;
  }
  /deep/ .el-date-editor {
    input {
      background: transparent;
    }
  }

  /deep/ .el-input {
    input {
      background: transparent;
    }
  }
}
</style>
