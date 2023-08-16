import { ChatMessages } from "@/types/chat"

export default function Messages({ messages }: { messages: ChatMessages[] }) {
  return (
    <div>
      {messages &&
        messages.map((message) => {
          console.log(message)
          return message.isFromChatbot ? (
            <div className="bg-gray-300" key={message.id}>
              {message.content}
            </div>
          ) : (
            <div key={message.id}>{message.content}</div>
          )
        })}
    </div>
  )
}
