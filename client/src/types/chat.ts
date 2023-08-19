export interface ChatMessage {
  id: number
  content: string
  isFromChatbot: boolean
}

export interface Cursor {
  key?: number
  size: number
}
