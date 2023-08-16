import Image from "next/image"
import { ChatMessage } from "@/types/chat"

function MessageBox({ message }: { message: ChatMessage }) {
  return (
    <div className={`${message.isFromChatbot ? "bg-gray-100 " : ""}flex justify-center items-center`}>
      <Image
        src={`${message.isFromChatbot ? "/svg/logo.svg" : "/svg/user.svg"}`}
        alt="icon"
        width={36}
        height={36}
        style={{ height: "16px" }}
      />
      <p className="w-[60%]">{message.content}</p>
    </div>
  )
}

export default function MessageBoxList({ messages }: { messages: ChatMessage[] }) {
  return (
    <div>
      {messages &&
        messages.map((message) => {
          console.log(message)
          return <MessageBox message={message} key={message.id} />
        })}
    </div>
  )
}
