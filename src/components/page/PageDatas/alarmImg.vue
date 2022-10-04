<!--
 * @Author: shlw@toplion.com.cn shlw@toplion.com.cn
 * @Date: 2022-09-29 22:56:19
 * @LastEditors: shlw@toplion.com.cn shlw@toplion.com.cn
 * @LastEditTime: 2022-10-04 12:55:52
 * @FilePath: /farbound/src/components/page/PageDatas/img.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="imgContainer">
    <div class="header">
      <i @click="back" class="el-icon-arrow-left icon"></i>
      <div>定时图片</div>
      <div class="selectRight">
        <el-select v-model="depart" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.depart_id"
            :label="item.depart_name"
            :value="item.depart_id">
          </el-option>
        </el-select>

        <el-date-picker
      v-model="timeInfo"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
      </div>
    </div>
    <div class="mainWrapper">
      <div class="leftArea">
        <div class="deviceList">
          <div class="listDetail" :class="[i == active ? 'active' : '' ]" v-for="(item,i) of deviceList" :key="i" @click="clickItem(item,i)">
            <span class="equipment">{{ i + 1 }}：{{ item.deviceName }}</span>
            <div class="status">
              <span :style="item.status==1 ?'background-color: #05d33f;':'background-color: #d62d00;' "></span>
              <span :style="item.status==1 ?'color: #05d33f;':'color: #d62d00;' ">{{item.status == 1 ? '在线' : '离线'}}</span>
            </div>
            <span class="tools" @click="onUpdate(item)"></span>
            <img class="poster" :src="item.poster" alt="">
          </div>
        </div>
      </div>
      <div class="rightArea">

        <el-image
        :src="a.detail[0].pic_url" v-for="a in imgList" :key="a.id"
        :preview-src-list="imgList.map(v => v.detail[0].pic_url)"></el-image>

        <!-- <img :src="el.detail[0].pic_url" v-for="el in imgList" :key="el.id" alt=""> -->
        <div class="emptyBox" v-if="!imgList || imgList.length == 0">
          暂无数据
          <!-- <el-empty v-if="!imgList || imgList.length == 0" description="暂无数据"></el-empty> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getdeviceList,
  getAlarmByDeviceSerialWithTime,
  reqDepartList
} from "@/api/index";

export default {
  data() {
    return {
      depart: "",
      options: [],
      userInfo: {},
      imgList: [],
      deviceList: [],
      active: 0,
      timeInfo: []
    };
  },
  watch: {
    depart(o) {
      this.getDeviceList(o);
    },
    timeInfo(o) {
      this.getimgList();
    }
  },
  created() {
    this.userInfo = JSON.parse(localStorage.getItem("user"));
    this.initAllDepart();
  },
  methods: {
    clickItem(item, i) {
      this.active = i;
      this.getimgList(item.deviceSerial);
    },
    clickItemDevice(item) {
      this.getimgList(item.deviceSerial);
    },
    initAllDepart() {
      reqDepartList({
        depart_id: this.userInfo.depart_id
      }).then(res => {
        this.options = res.data;
        this.getDeviceList(res.data[0].depart_id);
      });
    },
    getimgList(id) {
      getAlarmByDeviceSerialWithTime({
        deviceSerial: id || this.deviceList[this.active].deviceSerial,
        start:
          (this.timeInfo &&
            this.timeInfo[0] &&
            this.dateFormat(new Date(this.timeInfo[0]))) ||
          this.dateFormat(new Date().getTime() - 24 * 60 * 60 * 1000),
        end:
          (this.timeInfo &&
            this.timeInfo[0] &&
            this.dateFormat(new Date(this.timeInfo[1]))) ||
          this.dateFormat(new Date().getTime())
      }).then(res => {
        if (res.data.list && res.data.list.length > 0) {
          this.imgList = res.data.list.slice(0, 9);
        } else {
          this.imgList = [];
        }
      });
    },
    getDeviceList(id) {
      getdeviceList({
        depart_id: id || this.depart
      }).then(res => {
        this.deviceList = res.data.list;
        this.getimgList(res.data.list[0].deviceSerial);
      });
    },
    back() {
      this.$router.go(-1);
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
  .active {
    position: relative;
    &::after {
      content: "已选中";
      position: absolute;
      font-size: 12px;
      bottom: 5px;
      right: 5px;
      color: #7fc6c8;
    }
  }
  .listDetail {
    width: 100%;
    margin-top: 16px;
    border: 1px solid #7fc6c8;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    cursor: pointer;

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
      overflow: auto;
      box-sizing: border-box;
      padding: 0 16px;
    }
    .rightArea {
      flex: 1;
      max-height: 100%;
      .emptyBox {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
      }
      .el-image {
        width: 30%;
        height: 30%;
        margin-left: 2.5%;
        margin-top: 2.5%;
        border-radius: 10px;
      }
    }
  }
  .deviceList {
    color: #fff;
    .item {
      margin-top: 16px;
      border-bottom: 1px solid #fff;
      cursor: pointer;
    }
  }
  .header {
    display: flex;
    align-items: center;
    height: 60px;
    min-height: 60px;
    border-bottom: 1px solid #fff;
    width: 100%;
    color: #fff;
    font-weight: bold;
    .selectRight {
      margin-left: auto;
      margin-right: 32px;
    }
    .icon {
      font-size: 20px;
      padding: 10px;
      font-weight: bold;
      cursor: pointer;
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
}
</style>
