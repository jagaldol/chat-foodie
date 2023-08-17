import Image from "next/image"
import { useEffect, useState } from "react"
import { ChatMessage } from "@/types/chat"
import { limitInputNumber, pressEnter } from "@/utils/utils"

export default function MessageInputContainer({
  messages,
  handleStreamMessage,
  tempUserMessage,
  setTempUserMessage,
  prepareRegenerate,
}: {
  messages: ChatMessage[]
  handleStreamMessage: (message: string, regenerate: boolean) => void
  tempUserMessage: string
  setTempUserMessage: (message: string) => void
  prepareRegenerate: () => void
}) {
  const [displayRegenerate, setDisplayRegenerate] = useState(false)

  const [isGenerating, setIsGenerating] = useState(false)

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

  function generateFoodieResponse(userInputValue: string, regenerate: boolean) {
    // const socket = io.connect(`${process.env.NEXT_PUBLIC_API_URL}/api/public-chat`)
    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/api/public-chat`)

    let successConnect = false

    socket.addEventListener("open", () => {
      // 서버로 메시지 전송
      successConnect = true
      socket.send(
        JSON.stringify({
          input: userInputValue,
          history: makeHistory(),
          regenerate,
        }),
      )
    })

    socket.addEventListener("message", (event) => {
      const res = JSON.parse(event.data)
      switch (res.event) {
        case "text_stream": {
          handleStreamMessage(res.response, regenerate)
          return
        }
        case "stream_end":
          handleStreamMessage("", regenerate)
          break
        case "error":
          alert(res.response)
          break
        default:
          alert("서버 통신 중 오류가 발생했습니다.")
      }
      socket.close()
      if (regenerate) setDisplayRegenerate(true)
      setIsGenerating(false)
    })

    socket.addEventListener("close", () => {
      if (!successConnect) alert("채팅 서버에 연결할 수 없습니다!")
    })
  }

  const onRegenerateClick = () => {
    if (isGenerating) return
    setIsGenerating(true)
    setDisplayRegenerate(false)
    prepareRegenerate()
    generateFoodieResponse("", true)
  }

  const onSendClick = () => {
    if (isGenerating) return
    const userInputBox = document.querySelector<HTMLTextAreaElement>("#user-input-box")

    const userInputValue = userInputBox!.value
    if (userInputValue) {
      setTempUserMessage(userInputValue)
      setIsGenerating(true)
      generateFoodieResponse(userInputValue, false)

      userInputBox!.value = ""
    }
  }

  useEffect(() => {
    if (messages.length === 0) setDisplayRegenerate(false)
  }, [messages.length])

  useEffect(() => {
    if (tempUserMessage === "") setDisplayRegenerate(true)
  }, [tempUserMessage])

  return (
    <div className="flex justify-center">
      <div className="flex justify-center mt-3 mb-6 w-[60%] border-2 border-solid border-gray-400 rounded py-3 box-content relative">
        <button
          type="button"
          className={`w-[10rem] border bg-white border-gray-400 rounded flex justify-center items-center h-9 mb-4 absolute -top-14 opacity-70 hover:opacity-100 transition${
            displayRegenerate ? "" : " invisible"
          }`}
          onClick={onRegenerateClick}
        >
          <Image src="/svg/refresh.svg" alt="" width="16" height="16" style={{ height: "16px" }} />
          <p className="ml-2 text-sm">답변 재생성</p>
        </button>
        <textarea
          className="w-full focus:outline-none pl-5 mr-5 custom-scroll-bar-4px overflow-y scroll resize-none h-6"
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
        <button
          type="button"
          className={`w-10 flex justify-center items-center${isGenerating ? " hover:cursor-default" : ""}`}
          onClick={onSendClick}
        >
          {isGenerating ? (
            <div className="-translate-x-2">
              <div className="dot-elastic" />
            </div>
          ) : (
            <Image src="/svg/send.svg" alt="전송" width="16" height="16" />
          )}
        </button>
      </div>
    </div>
  )
}
