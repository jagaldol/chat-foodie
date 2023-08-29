import React, { useContext } from "react"
import { ChatMessage } from "@/types/chat"
import MessageBoxList from "@/containers/chat/message-box-list"
import { ChatroomContext } from "@/contexts/chatroomContextProvider"

export default function MessageBoxListContainer({
  messages, // cursor,getMessages,
}: {
  messages: ChatMessage[]
  // cursor: Cursor
  // getMessages: (_cursor: Cursor) => void
}) {
  const { chatroomId } = useContext(ChatroomContext)

  const exampleUserMessage: ChatMessage = {
    key: 1,
    content: "오늘 점심은 뭘 먹을까?",
    isFromChatbot: false,
  }

  const exampleChatbotMessage: ChatMessage = {
    key: 2,
    content:
      "라면에 김밥은 어떠신가요?\n" +
      "\n" +
      "- 한식 중에서 뭐 먹을까? 와 같이 원하는 음식 종류를 언급해도 좋아요!\n" +
      "- 특정 식재료나 요리 스타일을 언급하면 더 정확한 추천이 가능해요!\n" +
      "- 아래의 예시 질문을 클릭해보세요. foodie가 정성껏 답변해 드릴게요!",
    isFromChatbot: true,
  }

  return (
    <div className="grow flex justify-center items-center h-auto">
      {messages.length === 0 && chatroomId === 0 ? (
        <MessageBoxList messages={[exampleUserMessage, exampleChatbotMessage]} />
      ) : (
        <MessageBoxList
          messages={messages}
          // cursor={cursor}
          // getMessages={getMessages}
        />
      )}
    </div>
  )
}
