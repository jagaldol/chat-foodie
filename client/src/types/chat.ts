export interface ChatMessage {
  key: number
  id?: number
  content: string
  isFromChatbot: boolean
}

export interface Cursor {
  key?: number
  size: number
}
