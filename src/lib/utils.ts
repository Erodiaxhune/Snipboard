import fs from 'fs'
import path from 'path'
import { app, NativeImage, nativeImage } from 'electron'

export const DbPath = (): string => {
  // Get the path to the user data directory
  // On Linux, this is typically something like `/home/{username}/.config/{app name}`
  // On Windows, this is typically something like `C:\Users\{username}\AppData\Roaming\{app name}`
  // On macOS, this is typically something like `/Users/{username}/Library/Application Support/{app name}`
  const dbDir = path.join(app.getPath('userData'), 'database')

  // Create directory if it doesn't exist
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  if (process.platform !== 'win32') {
    try {
      fs.chmodSync(dbDir, 0o755) // RWX for owner, RX for others
    } catch (err) {
      console.warn('Could not set directory permissions:', err)
    }
  }

  return dbDir
}

export function isNativeImage(obj: unknown): obj is NativeImage {
  return obj instanceof nativeImage.constructor
}
