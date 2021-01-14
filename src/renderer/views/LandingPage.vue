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
          <el-button @click="downloadFile">下载文件</el-button>
          <el-button @click="downloadTest">下载文件2</el-button>
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
    openUrl () {
      const BrowserWindow = this.$electron.remote.BrowserWindow
      const newWindow = new BrowserWindow({
        height: 563,
        useContentSize: false,
        width: 300,
        webPreferences: {
          nodeIntegration: true
        },
        center: true,
        frame: false,
        backgroundColor: '#ccc',
        title: 'test',
        titleBarStyle: 'hidden'
      })
      const winURL =
        process.env.NODE_ENV === 'development'
          ? `http://localhost:9080/#/home?id=0005`
          : `file://${__dirname}/index.html/#/home`
      newWindow.webContents.closeDevTools()
      newWindow.loadURL(winURL)
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
    downloadFile () {
      // 获取用户选择的下载路径
      const { ipcRenderer } = this.$electron
      const { dialog } = this.$electron.remote
      let res = dialog.showOpenDialog({
        title: '请选择下载地址',
        properties: ['openFile', 'openDirectory'],
        buttonLabel: '确定地址'
      })
      // 将用户的选择的下载地址传给主线程
      ipcRenderer.send('downloadFile', res)
    },
    downloadFiles () {
      // 弹出dialog保存框，让用户选择
      const { dialog } = this.$electron.remote
      // const { ipcRenderer } = this.$electron
      // 获取到了文件地址和文件名
      let res = dialog.showSaveDialog({
        // 可以设置默认的文件名
        defaultPath: 'test.png'
      })
      console.log(res)
      // 发送axios请求获取文件流
      this.$http
        .post(
          'http://39.107.139.53:2000/api/FileInfo/DownLoad/4e59c30f-a746-411c-892f-0ed67290ce06',
          {
            headers: {
              responseType: 'Blob'
            }
          }
        )
        .then(result => {
          // 获取到数据流
          let { data } = result
          console.log(result)
          const blob = new Blob([data])
          // let fileName = res
          // if ('download' in document.createElement('a')) {
          //   // 非IE下载
          //   const elink = document.createElement('a')
          //   elink.download = fileName
          //   elink.style.display = 'none'
          //   elink.href = URL.createObjectURL(blob)
          //   document.body.appendChild(elink)
          //   elink.click()
          //   URL.revokeObjectURL(elink.href) // 释放URL 对象
          //   document.body.removeChild(elink)
          // } else {
          //   // IE10+下载
          //   navigator.msSaveBlob(blob, fileName)
          // }
          // 将数据流转成arraybuffer
          this.fileReader(blob).then(data => {
            this.writeData(res, data)
          })
        })
    },
    fileReader (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload = e => {
          resolve(e.target.result)
        }
      })
    },
    // 将blob写入文件内
    writeData (filePath, fileData) {
      // 将获取到的arraybuffer转成Dataview写入文件中
      const fs = require('fs')
      let bufferData = this.toBuffer(fileData)
      console.log(bufferData)
      fs.writeFile(filePath, bufferData, 'buffer', res => {
        console.log(res)
      })
    },
    // 将arraybuffer转成buffer
    toBuffer (ab) {
      let buf = Buffer.from(ab)
      let view = new Uint8Array(ab)
      for (var i = 0; i < buf.length; ++i) {
        buf[i] = view[i]
      }
      return buf
    },
    downloadTest () {
      const { dialog } = this.$electron.remote
      const request = require('request')
      const fs = require('fs')
      // const { ipcRenderer } = this.$electron
      // 获取到了文件地址和文件名
      let targetPath = dialog.showSaveDialog({
        // 可以设置默认的文件名
        defaultPath: 'test.png'
      })
      var receivedBytes = 0
      var totalBytes = 0
      var req = request({
        method: 'GET',
        url: 'http://192.168.18.160:8080/file/download/abc.pdf'
      })
      var out = fs.createWriteStream(targetPath)
      req.pipe(out)
      req.on('response', function (data) {
        // Change the total bytes value to get progress later.
        console.log(data)
        totalBytes = parseInt(data.headers['content-length'])
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
      const { ipcRenderer } = this.$electron
      var percentage = received / total
      ipcRenderer.send('processBar', percentage)
    }
    // uploadFile (file) {
    //   console.log (file)
    // }
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
