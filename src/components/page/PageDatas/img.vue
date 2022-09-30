<!--
 * @Author: shlw@toplion.com.cn shlw@toplion.com.cn
 * @Date: 2022-09-29 22:56:19
 * @LastEditors: shlw@toplion.com.cn shlw@toplion.com.cn
 * @LastEditTime: 2022-09-30 00:33:28
 * @FilePath: /farbound/src/components/page/PageDatas/img.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="imgContainer">
    <div class="header">
      <i @click="back" class="el-icon-arrow-left icon"></i>
      <div>定时图片</div>
    </div>
    <div class="mainWrapper">
      <div class="leftArea">
        <div class="selectRight">
        <el-select v-model="depart" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.depart_id"
            :label="item.depart_name"
            :value="item.depart_id">
          </el-option>
        </el-select>
      </div>
      <div class="deviceList">
        <div @click="clickItemDevice(a)" class="item" v-for="a in deviceList" :key="a.deviceSerial">{{ a.deviceName }}</div>
      </div>
      </div>
      <div class="rightArea">
        <img :src="el.detail[0].pic_url" v-for="el in imgList" :key="el.id" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import {
  getdeviceList,
  reqDeviceList,
  getimgList,
  reqDepartList
} from "@/api/index";

export default {
  data() {
    return {
      depart: "",
      options: [],
      userInfo: {},
      imgList: [],
      deviceList: []
    };
  },
  created() {
    this.userInfo = JSON.parse(localStorage.getItem("user"));
    this.initAllDepart();
  },
  methods: {
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
      getimgList({
        deviceSerial: id,
        start: this.dateFormat(new Date().getTime() - 24 * 60 * 60 * 1000),
        end: this.dateFormat(new Date().getTime())
      }).then(res => {
        this.imgList = res.data.list.slice(0, 9);
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
    }
    .rightArea {
      flex: 1;
      max-height: 100%;
      img {
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
    }
  }
}
</style>
