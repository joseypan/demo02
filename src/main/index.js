'use strict'

import { app, BrowserWindow, Menu, dialog, ipcMain, Tray } from 'electron'
const path = require('path')
// const fs = require('fs')
app.disableHardwareAcceleration()

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

let mainWindow
let tray
const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      nodeIntegration: true
    },
    center: true,
    frame: false,
    backgroundColor: '#fff',
    title: 'test',
    titleBarStyle: 'hidden'
  })
  // mainWindow.maximize()

  mainWindow.loadURL(winURL)
  showMenu()
  createTray()
  mainWindow.webContents.openDevTools()
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}
function showMenu () {
  const template = [
    {
      label: '关于',
      click () {
        dialog.showMessageBox({
          title: 'PicGo',
          message: 'PicGo',
          detail: '123'
        })
      }
    },
    {
      label: '打开详细窗口',
      click () {
        if (mainWindow === null) {
          createWindow()
          mainWindow.show()
        } else {
          mainWindow.show()
          mainWindow.focus()
        }
      }
    },
    {
      role: 'quit',
      label: '退出'
    }
  ]
  const contextMenu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(contextMenu)
}
function createTray () {
  const winPath = path.join(__static, '/menu_nodarwin.jpg')
  const darWinPath = path.join(__static, '/static/menubar.jpg')
  const menubarPic = process.platform === 'darwin' ? darWinPath : winPath
  tray = new Tray(menubarPic)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '打开应用',
      accelerator: 'shift+H',
      click: () => {
        mainWindow.show()
      }
    },
    { type: 'separator' },
    {
      label: '最小化',
      click: () => {
        mainWindow.hide()
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.quit()
      }
    }
  ]) // ...菜单
  tray.setToolTip('josey做的应用')
  tray.setContextMenu(contextMenu)
  tray.on('right-click', () => {
    // 右键点击
    mainWindow.hide() // 隐藏小窗口
    tray.popUpContextMenu(contextMenu) // 打开菜单
  })
  tray.on('click', () => {
    // 左键点击
    if (process.platform === 'darwin') {
      // 如果是macOS
      // toggleWindow() // 打开或关闭小窗口
    } else {
      // 如果是windows
      // mainWindow.hide() // 隐藏小窗口
      // if (mainWindow === null) { // 如果主窗口不存在就创建一个
      //   createWindow()
      //   mainWindow.show()
      // } else { // 如果主窗口在，就显示并激活
      mainWindow.show()
      mainWindow.focus()
      // }
    }
  })
}
app.on('ready', () => {
  createWindow()
})

app.on('window-all-closed', () => {
  tray = null
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('min', () => {
  mainWindow.minimize()
})
ipcMain.on('max', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow.maximize()
  }
})
ipcMain.on('close', () => mainWindow.close())
ipcMain.on('openChildWin', (e, arg) => {
  let positionX = arg.position.positionX - 300
  let positionY = arg.position.positionY
  console.log(positionX, positionY)
  const userInfoWin = new BrowserWindow({
    height: 500,
    useContentSize: true,
    resizable: false,
    width: 300,
    webPreferences: {
      nodeIntegration: true
    },
    x: positionX,
    y: positionY,
    frame: false,
    titleBarStyle: 'hidden',
    parent: mainWindow,
    show: false
  })
  // const WM_INITMENU = 0x116 当一个下拉菜单或子菜单将要被激活时发送此消息，它允许程序在它显示前更改菜单，而不要改变全部
  userInfoWin.hookWindowMessage(278, () => {
    userInfoWin.setEnabled(false)
    setTimeout(() => {
      userInfoWin.setEnabled(true)
    }, 100)
    return true
  })
  const winURL =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:9080/#${arg.path}`
      : `file://${__dirname}/index.html/#${arg.path}`
  userInfoWin.webContents.closeDevTools()
  userInfoWin.loadURL(winURL)
  userInfoWin.once('ready-to-show', () => {
    userInfoWin.show()
  })
  userInfoWin.on('blur', () => {
    userInfoWin.close()
  })
})
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
