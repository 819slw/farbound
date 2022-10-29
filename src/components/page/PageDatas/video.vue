<!--
 * @Author: shlw@toplion.com.cn shlw@toplion.com.cn
 * @Date: 2022-09-29 22:56:19
 * @LastEditors: shlw@toplion.com.cn shlw@toplion.com.cn
 * @LastEditTime: 2022-10-29 13:34:12
 * @FilePath: /farbound/src/components/page/PageDatas/img.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="imgContainer">
    <div class="header">
      <i @click="back" class="el-icon-arrow-left icon"></i>
      <div>实时视频</div>

      <div class="selectRight">
        <el-select v-model="depart" placeholder="请选择">
          <el-option
            v-for="item in departList"
            :key="item.depart_id"
            :label="item.depart_name"
            :value="item.depart_id">
          </el-option>
        </el-select>

        <el-select v-model="timeVal" placeholder="请选择">
          <el-option
            v-for="item in timerSelect"
            :key="item.val"
            :label="item.desc"
            :value="item.val">
          </el-option>
        </el-select>

<!-- 设备列表 -->
        <!-- <el-select v-model="deviceVal" placeholder="请选择">
          <el-option
            v-for="item in deviceList"
            :key="item.deviceSerial"
            :label="item.deviceName"
            :value="item.deviceSerial">
          </el-option>
        </el-select> -->

        <!-- 布局 -->
        <el-select v-model="potionVal" placeholder="请选择">
          <el-option
            v-for="item in positionList"
            :key="item.desc"
            :label="item.desc"
            :value="item.desc">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="mainWrapper">
      <div class="leftArea">
        <div class="deviceList">
          <div
            class="listDetail"
            v-for="(item,i) of deviceList"
            :key="i"
            @click="intoDeatil(item)"
            :class="[activeList.find(v => v == item.deviceSerial) ? 'active' : '' ]"
          >

            {{ item.deviceName }}

            <!-- <span class="equipment">{{ i + 1 }}：{{ item.deviceName }}</span>
            <div class="status">
              <span :style="item.status==1 ?'background-color: #05d33f;':'background-color: #d62d00;' "></span>
              <span :style="item.status==1 ?'color: #05d33f;':'color: #d62d00;' ">{{item.status == 1 ? '在线' : '离线'}}</span>
            </div>
            <span class="tools" @click="onUpdate(item)"></span>
            <img class="poster" :src="item.poster" alt=""> -->
          </div>
        </div>
      </div>
      <div class="rightArea" v-if="isPlayer">
        <div :class="[positionStyle[potionVal]]" class="commonStyle" v-for="(el,i) in palyerList" :key="i" @dblclick="dbclickHandle(el,i)">
          <div class="devicename">{{ el.name }}</div>
          <div :id="el.id"></div>
        </div>
      </div>
      <div class="rightArea flexCenter" v-if="!isPlayer">
        <i class="el-icon-loading"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { getdeviceList, reqDepartList, getToken } from "@/api/index";
import EZUIKit from "ezuikit-js";

export default {
  data() {
    return {
      isPlayer: true,
      token: "",
      deviceListOnline: [],
      timeVal: 1000 * 130,
      positionStyle: {
        "2x2": "foreGrid",
        "2x3": "sixGrid",
        "3x3": "nineGrid"
      },
      positionStyleNumber: {
        "2x2": 4,
        "2x3": 6,
        "3x3": 9
      },
      timerSelect: [
        {
          desc: "30s",
          val: 1000 * 30
        },
        {
          desc: "1分钟",
          val: 1000 * 60
        },
        {
          desc: "3分钟",
          val: 1000 * 60 * 3
        }
      ],
      palyerList: [
        {
          entity: null,
          id: "player1"
        },
        {
          entity: null,
          id: "player2"
        },
        {
          entity: null,
          id: "player3"
        },
        {
          entity: null,
          id: "player4"
        },
        {
          entity: null,
          id: "player5"
        },
        {
          entity: null,
          id: "player6"
        },
        {
          entity: null,
          id: "player7"
        },
        {
          entity: null,
          id: "player8"
        },
        {
          entity: null,
          id: "player9"
        }
      ],
      activeList: [],
      deviceVal: "",
      deviceList: [],
      departList: [],
      timer: null,
      depart: "",
      userInfo: {},
      potionVal: "2x2",
      num: 0,
      positionList: [
        {
          desc: "2x2"
        },
        {
          desc: "2x3"
        },
        {
          desc: "3x3"
        }
      ]
    };
  },
  watch: {
    depart(o) {
      this.getDeviceList(o);
    },
    potionVal(o) {
      this.isPlayer = false;
      setTimeout(() => {
        this.isPlayer = true;
        this.$nextTick(() => {
          this.initSettimeout();
          this.setPlayerNumber();
        });
      }, 1000);
    }
  },
  async mounted() {
    this.userInfo = JSON.parse(localStorage.getItem("user"));
    let res = await getToken();
    this.token = res.data.token;
    this.$nextTick(() => {
      this.initAllDepart();
      this.initSettimeout();
    });
  },
  methods: {
    setTitle(deviceName, i) {
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
        let dom = document.querySelector(`#player${i}`);
        console.log(dom);
        dom.appendChild(domDiv);
      });
    },
    dbclickHandle(obj, i) {
      obj.entity.fullScreen();
      // setTimeout(() => {
      this.setTitle(obj.name, i + 1);
      // }, 1000);
    },
    initSettimeout() {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.setPlayerNumber();
      }, this.timeVal);
    },
    intoDeatil(item) {
      if (item.status != 1) {
        this.$message.error("该设备离线中...");
        return;
      }
      this.$router.push(
        `/deviceDetail?deviceName=${item.deviceName}&deviceSerial=${
          item.deviceSerial
        }&lat=${item.lat}&lng=${item.lng}`
      );
    },
    back() {
      this.$message.info("正在关闭视频通道，2秒后返回");
      setTimeout(() => {
        this.palyerList = null;
        this.$router.go(-1);
      }, 2000);
    },
    initAllDepart(id) {
      reqDepartList({
        depart_id: id || this.userInfo.depart_id
      }).then(res => {
        this.departList = res.data;
        this.deviceVal = res.data[0].depart_id;
        this.getDeviceList(res.data[0].depart_id);
      });
    },
    clearAllEntity() {
      this.palyerList.forEach(v => {
        v.entity = null;
      });
    },
    createPlayer(deviceSerial, index, name) {
      let dom = document.querySelector(
        `.${this.positionStyle[this.potionVal]}`
      );
      let width = dom.offsetWidth;
      let height = dom.offsetHeight;
      this.palyerList[index].name = name;
      this.palyerList[index].entity = new EZUIKit.EZUIKitPlayer({
        id: this.palyerList[index].id, // 视频容器ID
        accessToken: this.token,
        template: "2ccb62e662de445d9d67e5f0e57af6e1",
        url: "ezopen://open.ys7.com/" + deviceSerial + "/1.hd.live",
        height,
        width
      });
    },
    setPlayerNumber() {
      this.clearAllEntity();
      let num = this.positionStyleNumber[this.potionVal];
      let playerArr = [];
      if (this.num + num > this.deviceListOnline.length - 1) {
        let diff = this.deviceListOnline.length - this.num;
        playerArr = [...this.deviceListOnline].splice(this.num, diff);
        playerArr = [
          ...playerArr,
          ...[...this.deviceListOnline].splice(0, num - diff)
        ];
        this.num = num - diff;
      } else {
        playerArr = [...this.deviceListOnline].splice(this.num, num);
        this.num += num;
      }
      this.activeList = playerArr.map(v => v.deviceSerial);
      playerArr.forEach((v, i) => {
        this.createPlayer(v.deviceSerial, i, v.deviceName);
      });
    },
    getDeviceList(id) {
      getdeviceList({
        depart_id: id || this.depart
      }).then(res => {
        this.num += 0;
        this.deviceList = res.data.list;
        this.deviceListOnline = res.data.list.filter(v => v.status == 1);
        this.setPlayerNumber();
      });
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
  .selectRight {
    margin-left: auto;
    margin-right: 32px;
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

  .active {
    position: relative;
    &::after {
      content: "正在播放";
      position: absolute;
      font-size: 12px;
      top: 5px;
      right: 5px;
      color: #7fc6c8;
    }
  }

  .listDetail {
    width: 100%;
    cursor: pointer;
    padding: 24px;
    display: flex;
    justify-content: center;
    align-items: center;

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
    }
    .commonStyle {
      box-sizing: border-box;
      border-bottom: 1px solid #fff;
      border-right: 1px solid #fff;
      position: relative;
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
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-wrap: wrap;
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
