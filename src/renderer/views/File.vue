<template>
  <div>
    <TitleBar />
    <el-button @click="watchFileChange">监控文件变化</el-button>
    <el-button @click="bigFileUpload">上传文件</el-button>
    <ul>
      <li v-for="item in uploadTaskList" :key="item.id">
        <div>{{ item.uploadProccess }}</div>
        <button @click="changeUploadState(item)">
          {{ item.isPause ? '继续' : '暂停' }}
        </button>
      </li>
    </ul>
    <!-- <el-button @click="test">调接口</el-button> -->
  </div>
</template>
<script>
import TitleBar from '../components/Common/TitleBar'
// const fs = require('fs')
export default {
  data () {
    return {
      flag: true,
      fileList: [],
      uploadTaskList: [
        {
          fileId: '1',
          filename: 'MASTERING_JS_FP.pdf',
          filePath: 'E:/书籍/MASTERING_JS_FP.pdf',
          uploadProccess: 0,
          isPause: false,
          isAbort: false
        },
        {
          fileId: '2',
          filename: 'MASTERING_JS_FP - 副本.pdf',
          filePath: 'E:/书籍/MASTERING_JS_FP - 副本.pdf',
          uploadProccess: 0,
          isPause: false,
          isAbort: false
        },
        {
          fileId: '3',
          filename: 'MASTERING_JS_FP - 副本 - 副本.pdf',
          filePath: 'E:/书籍/MASTERING_JS_FP - 副本 - 副本.pdf',
          uploadProccess: 0,
          isPause: false,
          isAbort: false
        }
      ]
    }
  },
  components: {
    TitleBar
  },
  methods: {
    // 监控文件变化方法
    watchFileChange () {
      const path = require('path')
      // const fs = require('fs')
      const { dialog } = this.$electron.remote
      const currentWin = this.$electron.remote.BrowserWindow.getFocusedWindow()
      const chokidar = require('chokidar')
      let dirPath = dialog.showOpenDialog(currentWin, {
        title: '选择需要监控的文件夹',
        properties: ['openFile', 'openDirectory']
      })
      if (!dirPath) {
        return
      }

      dirPath = path.resolve(dirPath[0])
      let ignoredFile = [
        'E:/filewatch/children/grand-children',
        'E:/filewatch/新建文件夹'
      ]
      const fileWatcher = chokidar.watch(dirPath, {
        persistent: true,
        ignored: ignoredFile
        // depth: 0
      })
      // 新增文件
      fileWatcher.on('add', path => {
        console.log(`${path} has been added`)
        // if (this.flag) {
        //   // 初始化获取文件夹内文件
        //   this.fileList.push(path)
        // }
      })
      fileWatcher.on('change', path => {
        console.log(`${path} has been changed`)
      })
      fileWatcher.on('unlink', path => {
        console.log(`${path} has been unlinked`)
      })
      fileWatcher.on('ready', () => {
        console.log('ready')
        // this.flag = false
        // while (this.fileList.length > 0) {
        //   let currentPath = this.fileList.shift()
        //   let fileContent = fs.readFileSync(currentPath) // buffer类型
        //   let blob = new Blob([fileContent]) // blob类型
        //   this.sliceFile(blob)
        // }
        // console.log('获取完了')
      })
      fileWatcher.on('error', error => {
        console.log(`${error} has been error`)
      })
      fileWatcher.on('addDir', path =>
        console.log(`Directory ${path} has been added`)
      )
      fileWatcher.on('unlinkDir', path =>
        console.log(`Directory ${path} has been removed`)
      )
    },
    // 更改暂停上传
    changeUploadState (item) {
      if (item.isPause) {
        // 继续
        item.isAbort = false
        item.isPause = false
        this.uploadShard(item)
      } else {
        // 暂停
        item.isPause = true
        item.isAbort = true
      }
      // this.uploadTaskList.forEach(element=>{

      // })
    },
    // 大文件上传
    async bigFileUpload () {
      for (let i = 0; i < this.uploadTaskList.length; i++) {
        let { filePath } = this.uploadTaskList[i]
        let fileAllInfo = this.readFileInfo(filePath)
        let { blob, fileInfo } = fileAllInfo
        let identifier = await this.preRequestFn(blob, fileInfo)
        let requestList = this.sliceFile(blob, { ...fileInfo, identifier })
        // 设置全局列表数据
        // this.globalUploadList.set(identifier, {
        //   totalChunks: fileInfo.totalChunks,
        //   requestList,
        // })
        this.uploadTaskList[i]['totalChunks'] = fileInfo.totalChunks
        this.uploadTaskList[i]['requestList'] = requestList
        await this.uploadShard(this.uploadTaskList[i])
      }
    },
    // 上传文件
    readFileInfo (filePath) {
      const fs = require('fs')
      let filename = filePath.split('/').reverse()[0]
      let fileContent = fs.readFileSync(filePath)
      let blob = new Blob([fileContent])
      // blob的总大小
      let totalSize = blob.size
      // 每片大小
      let chunkSize = 1024 * 1024
      // 计算一共有多少片
      let totalChunks = Math.ceil(totalSize / chunkSize)
      // this.sliceFile(blob)
      return {
        blob,
        fileInfo: {
          chunkNumber: 1,
          chunkSize,
          totalChunks,
          totalSize,
          filename
        }
      }
    },
    // 预请求方法
    async preRequestFn (blob, options) {
      let { filename } = options
      let requestArgument = {
        ...options,
        relativePath: filename
      }
      console.log(requestArgument)
      let res = await this.$http.post(
        'https://api.gtucloud.com/projects/06b24c21-7daf-9d2a-f8c3-c8d360d93ec2/directories/5b4b559f-6d3c-a6cd-9b5d-8ad86dfab89b/documents/add-checker',
        requestArgument,
        {
          headers: {
            Authorization:
              'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjRlYjAxYWU3LWU5ZmUtYWE3ZS03YTI2LWZmNjc5YmE0ZTY1NSIsImV4cCI6MTYxOTMxMDE1MH0.NJLUSdn2qGo6PYXaUsUx0UQpPRAdH7FckoPHCOdqrK4'
          }
        }
      )
      let identifier = res.data
      console.log('请求得来的identifier', identifier)
      return identifier
    },
    // 文件分片
    sliceFile (blob, data) {
      let { totalChunks, chunkSize, identifier, filename, totalSize } = data
      let requestList = []
      for (let i = 0; i < totalChunks; i++) {
        let start = i * chunkSize
        let end = Math.min((i + 1) * chunkSize, totalSize)
        let itemBlob = blob.slice(start, end)
        let formData = new FormData()
        console.log('identifier', identifier)
        formData.append('identifier', identifier)
        formData.append('file', itemBlob)
        formData.append('chunkNumber', i + 1)
        formData.append('totalSize', totalSize)
        formData.append('totalChunks', totalChunks)
        formData.append('chunkSize', chunkSize)
        formData.append('filename', filename)
        formData.append('relativePath', filename)
        formData.append('currentChunkSize', itemBlob.size)
        let requestFn = () => {
          return this.$http.post(
            'https://api.gtucloud.com/upload-file',
            formData,
            {
              headers: {
                'Content-type': 'multipart/form-data',
                Authorization:
                  'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjRlYjAxYWU3LWU5ZmUtYWE3ZS03YTI2LWZmNjc5YmE0ZTY1NSIsImV4cCI6MTYxOTMxMDE1MH0.NJLUSdn2qGo6PYXaUsUx0UQpPRAdH7FckoPHCOdqrK4'
              }
            }
          )
        }
        requestList.push(requestFn)
      }
      return requestList
    },
    // 分片上传
    async uploadShard (fileTaskObject) {
      // console.log('请求列表', requestList)
      let i = 0
      let totalRequestNum = fileTaskObject.totalChunks
      let send = async () => {
        if (fileTaskObject.requestList.length <= 0 || fileTaskObject.isAbort) {
          return
        }
        let res
        try {
          res = await fileTaskObject.requestList[i]()
        } catch (err) {
          fileTaskObject.isAbort = true
          fileTaskObject.isPause = true
          return
        }
        if (res.data === 'ACCEPTED' && res.status === 202) {
          // 还未上传成功
        } else if (res.status === 200) {
          let identifier = res.data
          this.test(identifier)
          // this.globalUploadList.delete(identifier)
        }
        fileTaskObject.requestList.shift()
        // console.log('删除之后的', this.globalUploadList.get(identifier))
        fileTaskObject.uploadProccess =
          (totalRequestNum - fileTaskObject.requestList.length) /
          totalRequestNum
        console.log(fileTaskObject.requestList)
        console.log(fileTaskObject.uploadProccess)
        await send()
      }
      await send()
    },

    async test (identifier) {
      let res = await this.$http({
        url: `https://api.gtucloud.com/projects/06b24c21-7daf-9d2a-f8c3-c8d360d93ec2/directories/5b4b559f-6d3c-a6cd-9b5d-8ad86dfab89b/documents/add?uploadFileId=${identifier}`,
        method: 'post',
        headers: {
          Authorization:
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjRlYjAxYWU3LWU5ZmUtYWE3ZS03YTI2LWZmNjc5YmE0ZTY1NSIsImV4cCI6MTYxOTMxMDE1MH0.NJLUSdn2qGo6PYXaUsUx0UQpPRAdH7FckoPHCOdqrK4'
        }
      })
      console.log(res)
    }
  }
}
</script>
<style lang="scss" scoped></style>
