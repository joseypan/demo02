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
  created () {
    const { process } = this.$electron.remote
    console.log(process)
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
