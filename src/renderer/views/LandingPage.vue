<template>
  <div id="wrapper">
    <TitleBar></TitleBar>
    <el-container>
      <el-aside width="200px">
        <el-menu default-active="2" class="el-menu-vertical-demo">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">导航二</span>
          </el-menu-item>
          <el-menu-item index="3" disabled>
            <i class="el-icon-document"></i>
            <span slot="title">导航三</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">导航四</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>
          <p>{{ themeTxt }}</p>
          <el-button @click="turnToHome">跳转</el-button>
          <el-button @click="openDialog">显示对话框</el-button>
          <el-button @click="openChildWin($event)">打开子页面</el-button>
          <el-upload
            class="upload-demo"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
          <el-button @click="downloadTest">下载文件</el-button>
          <el-button @click="previewFile">文件预览</el-button>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TitleBar from '@/components/Common/TitleBar'
export default {
  name: 'landing-page',
  data () {
    return {
      radio: '1',
      dialogVisible: false,
      themeTxt: '',
      isDarkMode: false,
      userId: 3
    }
  },
  components: {
    TitleBar
  },
  methods: {
    turnToHome () {
      this.$router.push('/home')
    },
    openDialog () {
      this.dialogVisible = true
    },
    openChildWin (e) {
      console.log(e)
      const { ipcRenderer } = this.$electron
      ipcRenderer.send('openChildWin', {
        path: `/userInfo?id=${this.userId}`,
        position: {
          positionX: e.screenX,
          positionY: e.screenY - e.clientY
        }
      })
    },
    downloadTest () {
      const { dialog } = this.$electron.remote
      const request = require('request')
      const fs = require('fs')
      // const { ipcRenderer } = this.$electron
      // 获取到了文件地址和文件名
      let targetPath = dialog.showSaveDialog({
        // 可以设置默认的文件名
        defaultPath: 'test23.png'
      })
      var receivedBytes = 0
      var totalBytes = 0
      var req = request({
        method: 'POST',
        url: 'http://39.107.139.53:2000/api/FileInfo/Preview/79b0f8e2-dd5c-4bab-97e0-885a248524ef',
        headers: {
          token: 'e6402d8b-c014-498e-ac34-6f74a786ce65'
        }
      })
      console.log('响应', req)
      var out = fs.createWriteStream(targetPath)
      req.pipe(out)
      console.log('总字节', req.dests[0])
      totalBytes = req.dests[0].bytesWritten
      req.on('response', function (data) {
        console.log('响应2', data)
        // Change the total bytes value to get progress later.
        // totalBytes = parseInt(data.headers['content-length'])
      })
      req.on('data', (chunk) => {
        // Update the received bytes
        receivedBytes += chunk.length
        this.showProgress(receivedBytes, totalBytes)
      })
      req.on('end', function () {
        alert('File succesfully downloaded')
      })
    },
    showProgress (received, total) {
      console.log(received, total)
      // const { ipcRenderer } = this.$electron
      var percentage = received / total
      console.log(percentage)
      // ipcRenderer.send('processBar', percentage)
    },
    previewFile () {
      // 思路：打开新窗口嵌套webview
      const { ipcRenderer } = this.$electron
      const previewPath = '123'
      ipcRenderer.send('previewFile', {
        path: '/previewFile',
        filePath: previewPath
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#wrapper {
  width: 100%;
  height: 100%;
  .el-container {
    width: 100%;
    height: 100%;
    .el-aside {
      height: 100%;
      border-right: 1px solid #ccc;
      overflow-x: hidden;
    }
  }
}
</style>
