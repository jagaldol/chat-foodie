"use client"

import { useEffect, useState } from "react"
import MessageInputContainer from "@/containers/chat/message-input-container"
import MessageBoxListContainer from "@/containers/chat/message-box-list-container"
import { ChatMessage } from "@/types/chat"
import { scrollDownChatBox } from "@/containers/chat/message-box-list"

export default function ChatUi() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [streamingMessage, setStreamingMessage] = useState<string>("")

  const addMessage = (message: ChatMessage) => {
    setMessages((messagesState) => {
      const saveMessage = { ...message }
      if (saveMessage.id === 0) {
        if (messagesState.length === 0) {
          // 없으면 1부터 시작
          saveMessage.id = 1
        } else {
          // 가장 마지막보다 1크게 부여
          saveMessage.id = messagesState[messagesState.length - 1].id
        }
        saveMessage.id = messagesState.length + 1
      }
      return [...messagesState, saveMessage]
    })
  }
  const handleStreamMessage = (message: string) => {
    setStreamingMessage((prevState) => {
      if (message === "") {
        const chatbotMessage: ChatMessage = {
          id: 0,
          content: prevState,
          isFromChatbot: true,
        }
        addMessage(chatbotMessage)
      }
      return message
    })
  }

  useEffect(() => {
    scrollDownChatBox()
  }, [messages])

  return (
    <div className="flex flex-col min-h-full">
      <MessageBoxListContainer messages={messages} streamingMessage={streamingMessage} />
      <MessageInputContainer messages={messages} addMessage={addMessage} handleStreamMessage={handleStreamMessage} />
    </div>
  )
}
