import { ipcMain } from 'electron'
import { Snipboard } from '../lib/database/snipboard'

// Creating an instance of Snipboard for IPC operations.
const snipboard = new Snipboard()

// Simple ping-pong test.
ipcMain.on('ping', () => console.log('pong'))

// Snipboard IPC Handlers
ipcMain.handle('snipboard-clear', async () => await snipboard.clear())
ipcMain.handle('snipboard-get-all', async () => await snipboard.getAll())
ipcMain.handle('snipboard-get', async (_, id) => await snipboard.get(id))
ipcMain.handle('snipboard-delete', async (_, id) => await snipboard.delete(id))
ipcMain.handle('snipboard-get-pinned', async () => await snipboard.getPinned())
ipcMain.handle('snipboard-pin', async (_, id, pinned) => await snipboard.pin(id, pinned))
ipcMain.handle(
  'snipboard-edit',
  async (_, id, updatedFields) => await snipboard.edit(id, updatedFields)
)
ipcMain.handle(
  'snipboard-save',
  async (_, content, snipType) => await snipboard.save(content, snipType)
)

export default ipcMain
