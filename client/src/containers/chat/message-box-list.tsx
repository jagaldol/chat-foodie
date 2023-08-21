import Image from "next/image"
import { ForwardedRef, useEffect, useRef } from "react"
import { ChatMessage } from "@/types/chat"

function MessageBox({ message, chatBox }: { message: ChatMessage; chatBox: ForwardedRef<HTMLDivElement> }) {
  useEffect(() => {
    if (typeof chatBox !== "function" && chatBox?.current) {
      const instance = chatBox.current
      instance.scrollTop = instance.scrollHeight
    }
  }, [chatBox])

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
  streamingMessage, // cursor, getMessages,
}: {
  messages: ChatMessage[]
  tempUserMessage: string
  streamingMessage: string
  // cursor: Cursor
  // getMessages: (_cursor: Cursor) => void
}) {
  // const [prevScrollHeight, setPrevScrollHeight] = useState(0)

  // const { chatroomId } = useContext(ChatroomContext)

  const chatBox = useRef<HTMLDivElement>(null)

  const scrollTraceDownChatBox = () => {
    if (chatBox.current) {
      if (chatBox.current.scrollHeight - (chatBox.current.scrollTop + chatBox.current.clientHeight) <= 30) {
        chatBox.current.scrollTop = chatBox.current.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollTraceDownChatBox()
  }, [streamingMessage])

  // useEffect(() => {
  //   const instance = chatBox.current!
  //   const handleScroll = () => {
  //     const { scrollTop, scrollHeight } = instance
  //
  //     if (scrollTop === 0 && chatroomId !== 0) {
  //       getMessages(cursor)
  //       // TODO: 위에 메시지들 끼워넣고 올바른 위치로 스크롤 옮기기
  //       instance.scrollTop = scrollHeight - prevScrollHeight
  //       setPrevScrollHeight(scrollHeight)
  //     }
  //   }
  //
  //   instance.addEventListener("scroll", handleScroll)
  //
  //   return () => {
  //     instance.removeEventListener("scroll", handleScroll)
  //   }
  // }, [prevScrollHeight, chatroomId, cursor, getMessages])

  return (
    <div className="w-full overflow-y-scroll custom-scroll-bar-10px h-full" id="chat-main" ref={chatBox}>
      {messages.map((message) => {
        return <MessageBox message={message} key={message.id} chatBox={chatBox} />
      })}
      {tempUserMessage !== "" ? (
        <MessageBox message={{ id: 0, content: tempUserMessage, isFromChatbot: false }} chatBox={chatBox} />
      ) : null}
      {streamingMessage !== "" ? (
        <MessageBox message={{ id: 0, content: streamingMessage, isFromChatbot: true }} chatBox={chatBox} />
      ) : null}
    </div>
  )
}
