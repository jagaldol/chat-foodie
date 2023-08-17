import Image from "next/image"
import { ChatMessage } from "@/types/chat"

function MessageBox({ message }: { message: ChatMessage }) {
  return (
    <div
      className={`${message.isFromChatbot ? "bg-gray-100 " : ""}pt-10 pb-14 flex justify-center items-center w-full`}
    >
      <div className="w-[60%] flex">
        <div className={`${message.isFromChatbot ? "bg-white " : ""} min-w-[30px] mr-10 h-fit`}>
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

export default function MessageBoxList({
  messages,
  streamingMessage,
}: {
  messages: ChatMessage[]
  streamingMessage: string
}) {
  return (
    <div className="w-full overflow-y-scroll custom-scroll-bar-10px h-full" id="chat-main">
      {messages.map((message) => {
        return <MessageBox message={message} key={message.id} />
      })}
      {streamingMessage !== "" ? (
        <MessageBox message={{ id: 0, content: streamingMessage, isFromChatbot: true }} />
      ) : null}
    </div>
  )
}

export const scrollDownChatBox = () => {
  const chatBox = document.querySelector<HTMLElement>("#chat-main")

  if (chatBox !== null) {
    chatBox.scrollTop = chatBox.scrollHeight
  }
}
