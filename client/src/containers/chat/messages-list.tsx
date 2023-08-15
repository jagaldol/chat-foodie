import { ChatMessages } from "@/types/chat"

export default function Messages({ messages }: { messages: ChatMessages[] }) {
  return (
    <div>
      {messages &&
        messages.map((message, index) => {
          console.log(message)
          return message.isFromChatbot ? (
            <div className="bg-gray-300" key={index}>
              {message.content}
            </div>
          ) : (
            <div>{message.content}</div>
          )
        })}
    </div>
  )
}
