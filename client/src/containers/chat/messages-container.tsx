import { ChatMessages } from "@/types/chat"
import Messages from "@/containers/chat/messages-list"

export default function MessagesContainer({ messages }: { messages: ChatMessages[] }) {
  return (
    <div className="grow flex justify-center items-center">
      {messages.length === 0 ? (
        <div className="grow flex justify-center items-center flex-col">
          <p>빈화면은 심심하니까</p>
          <br />
          <p>예시 채팅이라던지 튜토리얼 안내문</p>
        </div>
      ) : (
        <Messages messages={messages} />
      )}
    </div>
  )
}
