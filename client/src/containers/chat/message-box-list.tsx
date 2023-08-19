import Image from "next/image"
import { useContext, useEffect, useState } from "react"
import { ChatMessage, Cursor } from "@/types/chat"
import { ChatroomContext } from "@/contexts/chatroomContextProvider"

function MessageBox({ message }: { message: ChatMessage }) {
  useEffect(() => {
    const chatBox = document.querySelector<HTMLElement>("#chat-main")
    if (chatBox !== null) {
      chatBox.scrollTop = chatBox.scrollHeight
    }
  }, [])

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
  tempUserMessage,
  streamingMessage,
  cursor,
  getMessages,
}: {
  messages: ChatMessage[]
  tempUserMessage: string
  streamingMessage: string
  cursor: Cursor
  getMessages: (_cursor: Cursor) => void
}) {
  const [prevScrollHeight, setPrevScrollHeight] = useState(0)

  const { chatroomId } = useContext(ChatroomContext)

  const scrollTraceDownChatBox = () => {
    const chatBox = document.querySelector<HTMLElement>("#chat-main")
    if (chatBox !== null && chatBox.scrollHeight - (chatBox.scrollTop + chatBox.clientHeight) <= 30) {
      chatBox.scrollTop = chatBox.scrollHeight
    }
  }

  useEffect(() => {
    scrollTraceDownChatBox()
  }, [streamingMessage])

  useEffect(() => {
    const chatBox = document.querySelector<HTMLElement>("#chat-main")

    if (chatBox !== null) {
      const handleScroll = () => {
        const { scrollTop, scrollHeight } = chatBox

        if (scrollTop === 0 && chatroomId !== 0) {
          getMessages(cursor)
          // TODO: 위에 메시지들 끼워넣고 올바른 위치로 스크롤 옮기기
          chatBox.scrollTop = scrollHeight - prevScrollHeight
          setPrevScrollHeight(scrollHeight)
        }
      }

      chatBox.addEventListener("scroll", handleScroll)

      return () => {
        chatBox.removeEventListener("scroll", handleScroll)
      }
    }
    return () => {}
  }, [prevScrollHeight, chatroomId, cursor, getMessages])

  return (
    <div className="w-full overflow-y-scroll custom-scroll-bar-10px h-full" id="chat-main">
      {messages.map((message) => {
        return <MessageBox message={message} key={message.id} />
      })}
      {tempUserMessage !== "" ? (
        <MessageBox message={{ id: 0, content: tempUserMessage, isFromChatbot: false }} />
      ) : null}
      {streamingMessage !== "" ? (
        <MessageBox message={{ id: 0, content: streamingMessage, isFromChatbot: true }} />
      ) : null}
    </div>
  )
}
