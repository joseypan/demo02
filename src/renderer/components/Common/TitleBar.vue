<template>
  <div class="fake-title-bar">
    demo02 - {{ version }}
    <div class="offline-tips" v-show="!isOnline">
      网络断开中...
    </div>
    <div class="handle-bar" v-if="os === 'win32'">
      <!-- 如果是windows系统 就加上模拟的操作按钮-->
      <i class="el-icon-minus" @click="minimizeWindow"></i>
      <i class="el-icon-full-screen" @click="maxWindow"></i>
      <i class="el-icon-close" @click="closeWindow"></i>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      version: '0.0.1'
    }
  },
  methods: {
    minimizeWindow () {
      // 发送消息给主进程控制最小化窗口
      const ipcRenderer = this.$electron.ipcRenderer
      ipcRenderer.send('min')
    },
    maxWindow () {
      const ipcRenderer = this.$electron.ipcRenderer
      ipcRenderer.send('max')
    },
    closeWindow () {
      const ipcRenderer = this.$electron.ipcRenderer
      ipcRenderer.send('close')
    }
  },
  computed: {
    os () {
      const { process } = this.$electron.remote
      return process.platform
    },
    isOnline () {
      console.log(window.navigator.onLine)
      return navigator.onLine
    }
  }
}
</script>
<style lang="scss" scoped>
.fake-title-bar {
  position: relative;
  // height: 30px;
  line-height: 30px;
  padding: 0 10px;
  background-color: rgba(242, 110, 3, 0.4);
  -webkit-app-region: drag;
  // border-radius:0 0 5px 5px;
}
.offline-tips {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background: red;
  color: #fff;
  -webkit-app-region: no-drag;
}
.handle-bar {
  position: absolute;
  top: 0;
  right: 10px;
  -webkit-app-region: no-drag;
}
</style>
