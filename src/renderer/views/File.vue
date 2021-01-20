<template>
  <div>
    <el-button @click="watchFileChange">监控文件变化</el-button>
    <el-button @click="ossUpload">上传文件</el-button>
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
        depth: 2,
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
    },
    async ossUpload () {
      const { dialog } = this.$electron.remote
      let targetPath = dialog.showOpenDialog({
        // 可以设置默认的文件名
        properties: ['openFile']
      })
      const Oss = require('ali-oss')
      let client = new Oss({
        region: 'oss-cn-shanghai',
        accessKeyId: 'LTAI4G7DtuvJNsx3gJLaMn4p',
        accessKeySecret: 'frV9qxb9UAxXzZA6i7Ie6uErAovWzL',
        bucket: 'josey'
      })
      try {
        // 'object'表示上传到OSS的object名称，'localfile'表示本地文件或者文件路径。
        let r1 = await client.put('uploadFile', targetPath[0])
        console.log('put success: %j', r1)
        // let r2 = await client.get('object')
        // console.log('get success: %j', r2)
      } catch (e) {
        console.error('error: %j', e)
      }
    }
  }
}
</script>
<style lang="scss" scoped></style>
