import Image from "next/image"
import { ChatMessage } from "@/types/chat"
import { limitInputNumber, pressEnter } from "@/utils/utils"

export default function MessageInputContainer({
  messages,
  handleStreamMessage,
  setTempUserMessage,
}: {
  messages: ChatMessage[]
  handleStreamMessage: (message: string) => void
  setTempUserMessage: (message: string) => void
}) {
  const resizeBox = (e: any) => {
    e.target.style.height = "24px"
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
  }

  const makeHistory = () => {
    const messages38 = messages.slice(-38)
    const formattedMessages: string[] = []
    messages38.forEach((message) => {
      const isChatbotTurn = formattedMessages.length % 2 === 1

      if (isChatbotTurn && !message.isFromChatbot) {
        formattedMessages.push("")
      }
      if (!isChatbotTurn && message.isFromChatbot) {
        formattedMessages.push("")
      }
      formattedMessages.push(message.content)
    })

    if (formattedMessages.length % 2 === 1) formattedMessages.push("")

    const formattedMessages38 = formattedMessages.slice(-38)

    const history: string[][] = []
    for (let i = 0; i < formattedMessages38.length; i += 2) {
      history.push([formattedMessages38[i], formattedMessages38[i + 1]])
    }
    return history
  }

  function generateFoodieResponse(userInputValue: string) {
    // const socket = io.connect(`${process.env.NEXT_PUBLIC_API_URL}/api/public-chat`)
    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/api/public-chat`)

    socket.addEventListener("open", () => {
      // 서버로 메시지 전송
      socket.send(
        JSON.stringify({
          input: userInputValue,
          history: makeHistory(),
          regenerate: false,
        }),
      )
    })

    socket.addEventListener("message", (event) => {
      const res = JSON.parse(event.data)
      switch (res.event) {
        case "text_stream": {
          // const chatbotMessage: ChatMessage = {
          //   id: 0,
          //   content: res.response,
          //   isFromChatbot: true,
          // }
          handleStreamMessage(res.response)
          break
        }
        case "stream_end":
          console.log("종료 신호 옴")
          handleStreamMessage("")
          socket.close()
          break
        case "error":
          alert(res.response)
          break
        default:
          alert("서버 통신 중 오류가 발생했습니다.")
      }
    })

    socket.addEventListener("close", (event) => {
      console.log("WebSocket이 닫혔습니다.", event)
    })
  }

  const onSendClick = () => {
    const userInputBox = document.querySelector<HTMLTextAreaElement>("#user-input-box")

    const userInputValue = userInputBox!.value
    if (userInputValue) {
      setTempUserMessage(userInputValue)
      generateFoodieResponse(userInputValue)

      userInputBox!.value = ""
    }
  }

  return (
    <div className="flex justify-center">
      <div className="flex justify-center mt-3 mb-6 w-[60%] border-2 border-solid border-gray-400 rounded py-3 box-content relative">
        <button
          type="button"
          className="w-[10rem] border bg-white border-gray-400 rounded flex justify-center items-center h-9 mb-4 absolute -top-14 opacity-70 hover:opacity-100 transition"
        >
          <Image src="/svg/refresh.svg" alt="" width="16" height="16" style={{ height: "16px" }} />
          <p className="ml-2 text-sm">답변 재생성</p>
        </button>
        <textarea
          className="w-full focus:outline-none pl-5 custom-scroll-bar-4px overflow-y scroll resize-none h-6"
          id="user-input-box"
          onChange={(e) => {
            resizeBox(e)
            limitInputNumber(e, 500)
          }}
          onKeyDown={(e) => {
            pressEnter(e, onSendClick)
            resizeBox(e)
          }}
          placeholder="메시지를 입력해주세요"
        />
        <button type="button" className="w-10 flex justify-center items-center" onClick={onSendClick}>
          <Image src="/svg/send.svg" alt="전송" width="16" height="16" />
        </button>
      </div>
    </div>
  )
}
