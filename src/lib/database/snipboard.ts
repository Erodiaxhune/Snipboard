import EventEmitter from 'events'
import { snipboard as db } from '.'
import { SnipType, Snip } from 'types/types'

export const SnipboardEvents = new EventEmitter()

export class Snipboard {
  private generateId(): string {
    return `snip-${Date.now()}`
  }

  private categorizeContent(content: string): { type: SnipType; title: string } {
    const isLikelyCode =
      content.includes('\n') &&
      (/(?:\bfunction\s*\(|\b(?:const|let|var)\s+\w+\s*=|\b(?:if|for|while)\s*\(|\breturn\s+[^{;\s]|{[^}]*}|;\s*$)/.test(
        content
      ) ||
        /[{}]/.test(content))

    if (isLikelyCode) {
      return { type: 'code', title: 'Saved Code' }
    }
    if (content.startsWith('http://') || content.startsWith('https://')) {
      return { type: 'url', title: 'Saved URL' }
    }
    if (
      content.startsWith('#') ||
      content.startsWith('0x') ||
      content.startsWith('rgb(') ||
      content.startsWith('hsl(')
    ) {
      return { type: 'color', title: 'Saved Color' }
    }
    return { type: 'text', title: 'Saved Text' }
  }

  private async emitAction(id: string | null): Promise<void> {
    const snip = id ? await this.get(id) : null
    SnipboardEvents.emit('snip-action', snip)
  }

  // Helper to map stored JSON data to Snip interface.
  private mapRowToSnip(row: any): Snip {
    return {
      id: row.id,
      title: row.title,
      type: row.type as SnipType,
      content: row.content,
      pinned: Boolean(row.pinned),
      timeStamp: row.timeStamp
    }
  }

  public async close(): Promise<void> {
    await db.close()
  }

  public async save(content: string, snipType: 'text' | 'image'): Promise<Snip | null> {
    if (content.trim().length === 0) return null

    const timeStamp = new Date().toISOString()
    const id = this.generateId()

    // Prevent duplicates by checking if content already exists.
    const existingSnips = await this.getAll()
    const existingSnip = existingSnips.find(
      (s) => s.content.toLowerCase() === content.toLowerCase()
    )
    if (existingSnip) {
      await this.edit(existingSnip.id, { timeStamp })
      return this.get(existingSnip.id)!
    }

    const { type, title } =
      snipType === 'text'
        ? this.categorizeContent(content)
        : { type: 'image', title: 'Saved Image' }

    const snip = {
      id,
      title,
      type,
      content,
      timeStamp,
      pinned: false
    }

    // Save the new snip to LevelDB.
    await db.put(id, JSON.stringify(snip))

    this.emitAction(id)
    return this.get(id)
  }

  public async search(query: string): Promise<Snip[]> {
    const allSnips = await this.getAll()
    return allSnips.filter((snip) => snip.title.includes(query) || snip.content.includes(query))
  }

  public async get(id: string): Promise<Snip | null> {
    try {
      const row = await db.get(id)
      return this.mapRowToSnip(JSON.parse(row ?? '{}'))
    } catch (err: any) {
      console.error('Error getting snip:', err)
      return null
    }
  }

  public async getAll(): Promise<Snip[]> {
    const snips: Snip[] = []

    const iterator = db.iterator()

    try {
      for await (const [, value] of iterator) {
        const snip = JSON.parse(value.toString())
        snips.push(this.mapRowToSnip(snip))
      }
    } finally {
      iterator.close()
    }

    return snips.sort((a, b) => (a.timeStamp > b.timeStamp ? -1 : 1))
  }

  public async getPinned(): Promise<Snip[]> {
    const snips = await this.getAll()
    return snips.filter((snip) => snip.pinned)
  }

  // Clear all non-pinned snips.
  public async clear(): Promise<void> {
    const snips = await this.getAll()
    for (const snip of snips) {
      if (!snip.pinned) {
        await db.del(snip.id)
      }
    }
    this.emitAction(null)
  }

  public async delete(id: string): Promise<boolean> {
    try {
      await db.del(id)
      this.emitAction(id)
      return true
    } catch (err: any) {
      console.error('Error deleting snip:', err)
      return false
    }
  }

  public async edit(id: string, updatedFields: Partial<Omit<Snip, 'id'>>): Promise<boolean> {
    const snip = await this.get(id)
    if (!snip) return false

    const timeStamp = new Date().toISOString()
    updatedFields.timeStamp = timeStamp

    const updatedSnip = { ...snip, ...updatedFields, timeStamp }

    // Update snip in the database.
    await db.put(id, JSON.stringify(updatedSnip))

    this.emitAction(id)
    return true
  }

  public async pin(id: string, pinned: boolean = true): Promise<boolean> {
    const snip = await this.get(id)
    if (!snip) return false

    snip.pinned = pinned
    await db.put(id, JSON.stringify(snip))

    this.emitAction(id)
    return true
  }
}
