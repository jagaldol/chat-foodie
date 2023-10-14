"use client"

import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import MessageInputContainer from "@/containers/chat/message-input-container"
import MessageBoxListContainer from "@/containers/chat/message-box-list-container"
import { ChatMessage, Cursor } from "@/types/chat"
import { ChatroomContext } from "@/contexts/chatroomContextProvider"
import proxy from "@/utils/proxy"
import { getJwtTokenFromStorage } from "@/utils/jwtDecoder"
import { AuthContext } from "@/contexts/authContextProvider"

export default function ChatUi() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const messageNextKey = useRef<number>(1)

  const getMessagesLength = 20

  // const [cursor, setCursor] = useState<Cursor>({ size: getMessagesLength })

  const { userId } = useContext(AuthContext)
  const { chatroomId, setChatroomId } = useContext(ChatroomContext)

  const toChatMessageFormat = (messageList: ChatMessage[]): ChatMessage[] => {
    return messageList.map((message) => {
      const newMessage = { ...message }
      newMessage.key = messageNextKey.current
      messageNextKey.current += 1
      return newMessage
    })
  }
  const addMessage = (message: string, isFromChatbot: boolean) => {
    setMessages((messagesState) => {
      const chatMessage: ChatMessage = {
        key: 0,
        content: message,
        isFromChatbot,
      }
      return [...messagesState, ...toChatMessageFormat([chatMessage])]
    })
  }

  const handleStreamMessage = async (message: string) => {
    setMessages((prevState) => {
      const lastMessage = prevState[prevState.length - 1]
      if (lastMessage && lastMessage.isFromChatbot) {
        lastMessage.content = message
        return [...prevState.slice(0, -1), lastMessage]
      }
      const chatMessage: ChatMessage = {
        key: 0,
        content: message,
        isFromChatbot: true,
      }
      return [...prevState, ...toChatMessageFormat([chatMessage])]
    })
  }

  const handleStreamEndWhichCaseUser = (id: number, regenerate: boolean) => {
    setMessages((prevState) => {
      const chatbotMessage = prevState[prevState.length - 1]
      chatbotMessage.id = id
      if (regenerate) {
        return [...prevState.slice(0, -1), chatbotMessage]
      }
      const userMessage = prevState[prevState.length - 2]
      userMessage.id = id
      return [...prevState.slice(0, -2), userMessage, chatbotMessage]
    })
  }

  const prepareRegenerate = () => {
    setMessages((prevState) => prevState.slice(0, -1))
  }

  const getMessages = useCallback(
    (_cursor: Cursor) => {
      if (_cursor.key === -1) return
      const headers = { Authorization: getJwtTokenFromStorage() }
      const params = {
        // ..._cursor
      }
      proxy
        .get(`/chatrooms/${chatroomId}/messages`, { headers, params })
        .then((res) => {
          const patchedMessages = res.data.response.body.messages
          if (_cursor.key === undefined) {
            setMessages((prev) => {
              const remain = prev.filter((chatMessage) => chatMessage.id === undefined)
              return [...toChatMessageFormat(patchedMessages), ...remain]
            })
          } else {
            setMessages((prev) => [...toChatMessageFormat(patchedMessages), ...prev])
          }
          // const nextCursor = res.data.response.nextCursorRequest
          // setCursor({ key: nextCursor.key, size: nextCursor.size })
        })
        .catch((res) => {
          alert(res.response.data.errorMessage)
        })
    },
    [chatroomId],
  )

  useEffect(() => {
    const defaultCursor = { size: getMessagesLength }
    // setCursor(defaultCursor)
    if (chatroomId === 0) {
      setMessages([])
    } else {
      getMessages(defaultCursor)
    }
  }, [chatroomId, getMessages])

  useEffect(() => {
    setChatroomId(0)
    setMessages([])
  }, [userId, setChatroomId])

  return (
    <div className="flex flex-col min-h-full">
      <MessageBoxListContainer
        messages={messages}
        // cursor={cursor}
        // getMessages={getMessages}
      />
      <MessageInputContainer
        messages={messages}
        handleStreamMessage={handleStreamMessage}
        handleStreamEndWhichCaseUser={handleStreamEndWhichCaseUser}
        addUserMessage={(message: string) => addMessage(message, false)}
        prepareRegenerate={prepareRegenerate}
      />
    </div>
  )
}
