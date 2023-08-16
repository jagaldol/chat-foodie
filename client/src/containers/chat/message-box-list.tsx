import Image from "next/image"
import { ChatMessage } from "@/types/chat"

function MessageBox({ message }: { message: ChatMessage }) {
  return (
    <div className={`${message.isFromChatbot ? "bg-gray-100 " : ""}py-7 flex justify-center items-center w-full`}>
      <div className="w-[60%] flex items-center">
        <div className={`${message.isFromChatbot ? "bg-white " : ""} min-w-[30px] mr-10`}>
          <Image
            src={`${message.isFromChatbot ? "/svg/logo.svg" : "/svg/user.svg"}`}
            alt="icon"
            width={30}
            height={30}
            style={{ height: "30px" }}
          />
        </div>
        <p className="break-all whitespace-pre-line">{message.content}</p>
      </div>
    </div>
  )
}

export default function MessageBoxList({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="w-full overflow-y-scroll custom-scroll-bar-12px h-full">
      {messages.map((message) => {
        console.log(message)
        return <MessageBox message={message} key={message.id} />
      })}
    </div>
  )
}
