"use client"

import React, { useContext, useEffect, useState } from "react"
import MessageInputContainer from "@/containers/chat/message-input-container"
import MessageBoxListContainer from "@/containers/chat/message-box-list-container"
import { ChatMessage } from "@/types/chat"
import { scrollDownChatBox } from "@/containers/chat/message-box-list"
import { ChatroomContext } from "@/contexts/chatroomContextProvider"
import proxy from "@/utils/proxy"
import { getJwtTokenFromStorage } from "@/utils/jwtDecoder"

export default function ChatUi() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [tempUserMessage, setTempUserMessage] = useState<string>("")
  const [streamingMessage, setStreamingMessage] = useState<string>("")

  const { chatroomId, setChatroomId } = useContext(ChatroomContext)
  const addMessage = (message: ChatMessage) => {
    setMessages((messagesState) => {
      const saveMessage = { ...message }
      if (saveMessage.id === 0) {
        if (messagesState.length === 0) {
          // 없으면 1부터 시작
          saveMessage.id = 1
        } else {
          // 가장 마지막보다 1크게 부여
          saveMessage.id = messagesState[messagesState.length - 1].id + 1
        }
      }
      return [...messagesState, saveMessage]
    })
  }
  const handleStreamMessage = (message: string, regenerate: boolean) => {
    if (!regenerate && message === "") {
      setTempUserMessage((prevState) => {
        const userMessage: ChatMessage = {
          id: 0,
          content: prevState,
          isFromChatbot: false,
        }
        addMessage(userMessage)
        return ""
      })
    }
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

  const prepareRegenerate = () => {
    setMessages((prevState) => prevState.slice(0, -1))
  }

  useEffect(() => {
    scrollDownChatBox()
  }, [streamingMessage])

  useEffect(() => {
    const currentChatroomId: number = chatroomId

    if (currentChatroomId === 0) {
      setMessages([])
    } else {
      const headers = { Authorization: getJwtTokenFromStorage() }
      const params = { size: 2 }
      proxy
        .get(`/chatrooms/${currentChatroomId}/messages`, { headers, params })
        .then((res) => {
          setMessages(res.data.response.body.messages)
        })
        .catch((res) => {
          alert(res.response.data.errorMessage)
        })
    }
  }, [chatroomId])

  return (
    <div className="flex flex-col min-h-full">
      <label htmlFor="chatroomIdtemp" className="block w-80 h-16 mb-3">
        <span className="block text-sm font-medium text-slate-700">임시 채팅방 선택창(진짜 있는 채팅방만 선택!!)</span>
        <select
          name="chatroomIdtemp"
          className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-main-theme focus:ring-main-theme block w-full rounded-md sm:text-sm focus:ring-1"
          onChange={(e) => {
            setChatroomId(Number(e.currentTarget.value))
          }}
          value={chatroomId}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <option value={num} key={num}>
              {num}
            </option>
          ))}
        </select>
      </label>
      <MessageBoxListContainer
        messages={messages}
        tempUserMessage={tempUserMessage}
        streamingMessage={streamingMessage}
      />
      <MessageInputContainer
        messages={messages}
        handleStreamMessage={handleStreamMessage}
        setTempUserMessage={setTempUserMessage}
        prepareRegenerate={prepareRegenerate}
      />
    </div>
  )
}
