<template>
  <div>
    <div style="position: absolute;flex-direction: row">
      <div id="video-container"></div>
      <div style="width: 30%;height: 100%;background-color: #3a8ee6"></div>
    </div>
  </div>
</template>

<script>
import EZUIKit from "ezuikit-js"
import {getToken} from "../../../api";

export default {
  name: "preview",
  mounted() {
    let device = this.$parent.$parent.getRow()
    let deviceSerial = device.deviceSerial
    let user = JSON.parse(localStorage.getItem("user"))
    let width = screen.availWidth * 0.6
    let height = screen.availHeight * 0.8
    var player
    getToken().then(rsp => {
      player = new EZUIKit.EZUIKitPlayer({
        id: 'video-container', // 视频容器ID
        accessToken: rsp.data.token,
        template: "security",
        url: 'ezopen://open.ys7.com/' + deviceSerial + '/1.live',
        height,
        width
      })
    })

    // console.log(this.$parent.getRow())

    this.$parent.$parent.closePlayerCallback = () => {
      return player.stop()
      // this.$parent.$parent.closePlayerCallback = null
    }
  }
}
</script>

<style scoped>

</style>
