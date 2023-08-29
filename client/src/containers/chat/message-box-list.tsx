import Image from "next/image"
import { useContext, useEffect, useRef } from "react"
import { ChatMessage } from "@/types/chat"
import { ChatroomContext } from "@/contexts/chatroomContextProvider"

function MessageBox({ message }: { message: ChatMessage }) {
  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight)
  }, [])

  return (
    <div
      className={`${message.isFromChatbot ? "bg-gray-100 " : ""}pt-10 pb-14 flex justify-center items-center w-full`}
    >
      <div className="w-[50%] max-lg:w-[70%] max-md:w-[90%] flex">
        <div className={`${message.isFromChatbot ? "bg-white " : ""} min-w-[30px] mr-10 max-md:mr-5 h-fit`}>
          <Image
            src={`${message.isFromChatbot ? "/svg/logo.svg" : "/svg/user.svg"}`}
            alt="icon"
            width={30}
            height={30}
            style={{ height: "30px" }}
          />
        </div>
        <p className="break-all whitespace-pre-line max-md:text-sm">{message.content}</p>
      </div>
    </div>
  )
}

export default function MessageBoxList({
  messages, // cursor, getMessages,
}: {
  messages: ChatMessage[]
  // cursor: Cursor
  // getMessages: (_cursor: Cursor) => void
}) {
  // const [prevScrollHeight, setPrevScrollHeight] = useState(0)

  const { chatroomId } = useContext(ChatroomContext)
  const scrollTraceDownChatBox = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 30) {
      window.scrollTo(0, document.body.scrollHeight)
    }
  }

  useEffect(() => {
    scrollTraceDownChatBox()
  }, [messages])

  useEffect(() => {
    scrollTraceDownChatBox()
  }, [chatroomId])

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
    <div className="w-full h-full" id="chat-main">
      {messages.map((message) => {
        return <MessageBox message={message} key={message.key} />
      })}
    </div>
  )
}
