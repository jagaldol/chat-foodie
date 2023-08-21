"use client"

import React, { useCallback, useContext, useEffect, useState } from "react"
import MessageInputContainer from "@/containers/chat/message-input-container"
import MessageBoxListContainer from "@/containers/chat/message-box-list-container"
import { ChatMessage, Cursor } from "@/types/chat"
import { ChatroomContext } from "@/contexts/chatroomContextProvider"
import proxy from "@/utils/proxy"
import { getJwtTokenFromStorage } from "@/utils/jwtDecoder"
import { AuthContext } from "@/contexts/authContextProvider"

export default function ChatUi() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [tempUserMessage, setTempUserMessage] = useState<string>("")
  const [streamingMessage, setStreamingMessage] = useState<string>("")

  const getMessagesLength = 20

  // const [cursor, setCursor] = useState<Cursor>({ size: getMessagesLength })

  const { userId } = useContext(AuthContext)
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

  const handleStreamMessage = async (message: string, regenerate: boolean, chatroomIdToSend: number) => {
    if (!regenerate && message === "") {
      setTempUserMessage((prevState) => {
        const userMessage: ChatMessage = {
          id: 0,
          content: prevState,
          isFromChatbot: false,
        }
        if (userId === 0) addMessage(userMessage)
        return ""
      })
    }

    let messagesToAdd: ChatMessage[] = []
    if (message === "" && userId !== 0) {
      const headers = { Authorization: getJwtTokenFromStorage() }
      const params = { size: 2 }
      const res = await proxy.get(`/chatrooms/${chatroomIdToSend}/messages`, { headers, params })
      const newMessages: ChatMessage[] = res.data.response.body.messages
      if (messages.length === 0) {
        messagesToAdd = newMessages
      } else {
        const skipIndex = newMessages.map((m) => m.id).indexOf(messages.at(-1)!.id)
        messagesToAdd = skipIndex === -1 ? newMessages : newMessages.slice(skipIndex)
      }
    }

    setStreamingMessage((prevState) => {
      if (message === "") {
        const chatbotMessage: ChatMessage = {
          id: 0,
          content: prevState,
          isFromChatbot: true,
        }
        if (userId === 0) addMessage(chatbotMessage)
        else {
          setMessages((prev) => [...prev, ...messagesToAdd])
        }
      }
      return message
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
            setMessages(patchedMessages)
          } else {
            setMessages((prev) => [...patchedMessages, ...prev])
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
      {userId !== 0 ? (
        <label htmlFor="chatroomIdtemp" className="block w-80 h-16 mb-3">
          <span className="block text-sm font-medium text-slate-700">
            임시 채팅방 선택창(진짜 있는 채팅방만 선택!!)
          </span>
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
      ) : null}
      <MessageBoxListContainer
        messages={messages}
        tempUserMessage={tempUserMessage}
        streamingMessage={streamingMessage}
        // cursor={cursor}
        // getMessages={getMessages}
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
