<template>
  <div>
    <el-button @click="watchFileChange">监控文件变化</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    watchFileChange () {
      // 弹窗
      const { dialog } = this.$electron.remote
      //   const fs = require('fs')
      //   const path = require('path')
      const chokidar = require('chokidar')
      // const { ipcRenderer } = this.$electron
      // 获取到了文件地址和文件名
      let targetPath = dialog.showOpenDialog({
        // 可以设置默认的文件名
        properties: ['openFile', 'openDirectory']
      })
      // 使用 fs.watch()监听器的示例。
      // Initialize watcher.
      const watcher = chokidar.watch(targetPath, {
        ignoreInitial: true,
        persistent: true,
        awaitWriteFinish: {
          stabilityThreshold: 2000,
          pollInterval: 100
        }
      })

      // Something to use when events are received.
      const log = console.log.bind(console)
      // Add event listeners.
      watcher
        .on('add', path => log(`File ${path} has been added`))
        .on('change', path => log(`File ${path} has been changed`))
        .on('unlink', path => log(`File ${path} has been removed`))
    }
  }
}
</script>
<style lang="scss" scoped></style>
