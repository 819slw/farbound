<template>
  <div>
    <div id="playWind"></div>
  </div>
</template>

<script>
import {
  reqDeviceList, getToken
} from "../../../api"

export default {
  name: "lunxun",
  data() {
    return {
      deviceList: [],
      onlineDeviceList: [],
      playing: false,
      player: null,
      currentDevice: [],
      win: [0, 1, 2, 3]
    }
  },
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem('user'))
    this.getDevice()
  },
  beforeDestroy() {
    if (this.decoder) {
      console.log("销毁")
      this.currentDevice.forEach((it, index) => {
        this.decoder.stop(index)
      })

    }
  },
  methods: {
    //获取设备列表
    getDevice() {
      reqDeviceList({depart_id: this.userInfo.depart_id}).then(res => {
        if (res.code == 200 || res.code == 0) {
          this.deviceList = res.data;
          this.deviceList.forEach(it => {
            if (it.status)
              this.onlineDeviceList.push(it)
          })
          if (!this.playing) {
            this.playing = true
            this.initplayer()
          }
        }
      });
    },
    getaddr(deviceSerial) {
      return 'ezopen://open.ys7.com/' + deviceSerial + '/1.hd.live'
    },
    initplayer() {
      if (this.onlineDeviceList.length) {
        let obj = this.geturl()
        let width = screen.availWidth
        let height = screen.availHeight * 0.8
        getToken().then(rsp => {
          // console.log(this.$parent.getRow())
          this.decoder = new EZUIKit_YS.EZUIPlayer({
            id: 'playWind',
            autoplay: true,
            url: obj.url,
            accessToken: rsp.data.token,
            decoderPath: '../../../../static/EZUIKit-JavaScript',
            width: width - 40,
            height,
            splitBasis: 2, // 1*1 2*2 3*3 4*4
          });
          setInterval(() => {
            this.stop(() => {
              this.win = [0, 1, 2, 3]
              this.decoder.destroy()
              this.decoder = null
              this.initplayer()
            })

          }, 60 * 1000 * 2)
        })


      }
    },
    stop(cb) {
      if (this.win.length) {
        let i = this.win.shift()
        this.decoder.stop(i).then(rsp => {
          this.stop(cb)
        })
      } else {
        cb()
      }
    },
    geturl() {
      this.currentDevice = this.onlineDeviceList.splice(0, 4)
      let urls = []
      this.currentDevice.forEach(it => {
        urls.push(this.getaddr(it.deviceSerial))
      })
      this.onlineDeviceList.push(...this.currentDevice)
      let splitBasis = 2
      if (this.currentDevice.length === 1) {
        splitBasis = 1
      }
      return {url: urls.join(","), splitBasis}
    }

  }
}
</script>

<style scoped>

</style>
