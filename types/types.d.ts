export type SnipType = 'text' | 'image' | 'color' | 'url' | 'code'

export interface Snip {
  id: string
  title: string
  type: SnipType
  content: string
  pinned: boolean
  timeStamp: string
}
