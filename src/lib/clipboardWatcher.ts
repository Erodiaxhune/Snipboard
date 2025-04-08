import { debounce } from 'lodash'
import { createHash } from 'crypto'
import { EventEmitter } from 'events'
import { clipboard as clipboardAPI, NativeImage } from 'electron'

const emitter = new EventEmitter()

export class clipboardWatcher {
  private clipboard: typeof clipboardAPI
  private prevText: string | null = null
  private prevImageHash: string | null = null
  private watcherInterval: NodeJS.Timeout | null = null

  constructor() {
    this.clipboard = clipboardAPI
  }

  // Start watching clipboard changes with debouncing
  startWatching(): void {
    if (!this.watcherInterval) {
      this.watcherInterval = setInterval(
        debounce(() => {
          // TODO: on initial load, do not emit events
          const text = this.clipboard.readText()
          const image = this.clipboard.readImage()

          if (text && text.length > 0 && this.isDiffText(text)) {
            this.prevText = text
            emitter.emit('text-changed', text)
          }

          if (image && !image.isEmpty() && this.isDiffImage(image)) {
            this.prevImageHash = this.getImageHash(image)
            emitter.emit('image-changed', image)
          }
        }, 300),
        500
      )
    }

    // Trigger initial check
    debounce(() => {
      const text = this.clipboard.readText()
      const image = this.clipboard.readImage()

      if (text && text.length > 0 && this.isDiffText(text)) {
        this.prevText = text
        emitter.emit('text-changed', text)
      }

      if (this.isDiffImage(image)) {
        this.prevImageHash = this.getImageHash(image)
        emitter.emit('image-changed', image)
      }
    }, 300)()
  }

  // Stop watching clipboard changes
  stopWatching(): void {
    if (this.watcherInterval) {
      clearInterval(this.watcherInterval)
      this.watcherInterval = null
      this.prevText = null
      this.prevImageHash = null
    }
  }

  on(
    event: 'text-changed' | 'image-changed',
    listener: (data: string | NativeImage) => void
  ): void {
    emitter.on(event, listener)
  }

  off(
    event: 'text-changed' | 'image-changed',
    listener: (data: string | NativeImage) => void
  ): void {
    emitter.off(event, listener)
  }

  // Private helper: Checks if the text has changed
  private isDiffText(text: string): boolean {
    return text !== this.prevText
  }

  // Private helper: Checks if the image has changed (using SHA-256 hashing)
  private isDiffImage(image: NativeImage): boolean {
    const newHash = this.getImageHash(image)
    return newHash !== this.prevImageHash
  }

  // Generate SHA-256 hash of the image to compare instead of storing full image
  private getImageHash(image: NativeImage): string {
    return createHash('sha256').update(image.toPNG()).digest('hex')
  }
}
