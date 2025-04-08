import '../lib/database/index' // Initialize the LevelDB

import { join } from 'path'
import cron from 'node-cron'
import { isNativeImage } from '../lib/utils'
import icon from '../../resources/icon.png?asset'
import { clipboardWatcher } from '../lib/clipboardWatcher'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { Snipboard, SnipboardEvents } from '../lib/database/snipboard'
import { app, Tray, Menu, shell, screen, ipcMain, BrowserWindow, globalShortcut } from 'electron'

// Global variables
let initialY: number
let tray: Tray | null = null
let mainWindow: BrowserWindow | null = null

const snipboard = new Snipboard()
const clipboard = new clipboardWatcher()

// Scheduled cleanup to run at midnight every day
cron.schedule('0 0 * * *', async () => {
  console.log('Running cleanup job to remove expired snips...')
  try {
    // Retrieves all snips from the database
    const snips = await snipboard.getAll()
    const now = new Date()

    // Iterates through each snip and delete if criteria are met
    for (const snip of snips) {
      // Only delete snips that are not pinned
      if (!snip.pinned) {
        const snipTime = new Date(snip.timeStamp)
        const diffDays = (now.getTime() - snipTime.getTime()) / (1000 * 60 * 60 * 24)
        if (diffDays >= 3) {
          await snipboard.delete(snip.id)
          console.log(`Deleted snip ${snip.id} (older than 3 days)`)
        }
      }
    }
  } catch (error) {
    console.error('Error during cleanup:', error)
  }
})

Menu.setApplicationMenu(null)

/** Creating and position the main browser window */
function createWindow(): void {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const windowSize = {
    width: Math.floor(width * 0.998),
    height: 520
  }
  const x = Math.floor((width - windowSize.width) / 2)
  const y = Math.floor(height - windowSize.height - 10)
  initialY = y

  mainWindow = new BrowserWindow({
    x,
    y,
    width: windowSize.width,
    height: windowSize.height,
    show: true,
    frame: false,
    movable: false,
    resizable: false,
    transparent: true,
    alwaysOnTop: true,
    roundedCorners: true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      sandbox: false,
      preload: join(__dirname, '../preload/index.js')
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
    mainWindow?.focus()
  })

  mainWindow.on('show', () => {
    mainWindow?.webContents.send('reset-scroll')
  })

  // Open external URLs in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // Load URL or local file based on environment
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

/** Creating the system tray icon and its interactions */
function createTray(): void {
  tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Snipboard 1.0.0',
      type: 'normal',
      enabled: false
    },
    { type: 'separator' },
    {
      label: 'Settings',
      type: 'normal',
      click: (): void => {}
    },
    {
      label: 'Quit',
      type: 'normal',
      click: (): void => app.quit()
    }
  ])

  tray.setTitle('Snipboard')
  tray.setToolTip('Snipboard')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    tray?.closeContextMenu()
    showMainWindow()
  })

  // Using right-click to display context menu
  tray.on('right-click', () => {
    if (tray) {
      tray.popUpContextMenu(contextMenu)
    }
  })

  // Highlight on hover
  tray.on('mouse-move', () => {
    tray?.setToolTip('Snipboard - Click to open')
    // tray?.setImage(highlightIcon)
  })
}

/** Helper function to show or create the main window */
function showMainWindow(): void {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createWindow()
  } else if ((mainWindow && !mainWindow.isDestroyed()) || !mainWindow.isFocused()) {
    mainWindow.setBounds({
      x: mainWindow.getBounds().x,
      y: initialY,
      width: mainWindow.getBounds().width,
      height: mainWindow.getBounds().height
    })
    mainWindow.show()
    mainWindow.focus()
  } else {
    mainWindow.hide()
  }
}

// Disable hardware acceleration to avoid driver issues
app.disableHardwareAcceleration()

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  // Watch for window shortcuts (like F12 in dev)
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()
  createTray()

  // Handle app activation for macOS
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Global shortcuts and clipboard manager
app.on('ready', () => {
  globalShortcut.unregisterAll()

  globalShortcut.register('CommandOrControl+Shift+V', () => {
    showMainWindow()
  })

  clipboard.startWatching()

  clipboard.on('text-changed', async (text) => {
    if (mainWindow) {
      await snipboard.save(text as string, 'text')
      mainWindow.webContents.send('clipboard-text', text)
    }
  })

  clipboard.on('image-changed', async (image) => {
    if (isNativeImage(image)) {
      if (!image.isEmpty()) {
        if (mainWindow) {
          await snipboard.save(image.toDataURL(), 'image')
          mainWindow.webContents.send('clipboard-image', image)
        }
      } else {
        console.log('Clipboard contains an empty image')
      }
    } else {
      console.log('Invalid image type:', image)
    }
  })

  // Relaing snip actions to renderer process
  SnipboardEvents.on('snip-action', (snip) => {
    mainWindow?.webContents.send('snip-action', snip)
  })
})

// Hiding window instead of quitting (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    mainWindow?.hide()
  }
})

app.on('before-quit', () => {
  globalShortcut.unregisterAll()
  clipboard.stopWatching()
  snipboard.close().catch((err) => {
    console.error('Error closing Snipboard:', err)
  })
})

// Hide window when it loses focus
app.on('browser-window-blur', () => {
  mainWindow?.hide()
})

// IPC listener to hide window on demand
ipcMain.handle('hide-window', () => {
  mainWindow?.hide()
})

// Loading additional IPC handlers and utilities
import './ipc'
