import MessageInputContainer from "@/containers/chat/message-input-container"
import MessagesContainer from "@/containers/chat/messages-container"

export default function ChatUi() {
  return (
    <div className="flex flex-col min-h-full">
      <MessagesContainer />
      <MessageInputContainer />
    </div>
  )
}
