import { ChatMessage } from "@/types/chat"
import MessageBoxList from "@/containers/chat/message-box-list"

export default function MessageBoxListContainer({
  messages, // cursor,getMessages,
}: {
  messages: ChatMessage[]
  // cursor: Cursor
  // getMessages: (_cursor: Cursor) => void
}) {
  return (
    <div className="grow flex justify-center items-center h-0">
      {messages.length === 0 ? (
        <div className="grow flex justify-center items-center flex-col">
          <p>빈화면은 심심하니까</p>
          <br />
          <p>예시 채팅이라던지 튜토리얼 안내문</p>
        </div>
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
