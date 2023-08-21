import Image from "next/image"
import { useContext, useState } from "react"
import { undefined } from "zod"
import { ChatMessage } from "@/types/chat"
import { limitInputNumber, pressEnter } from "@/utils/utils"
import { AuthContext } from "@/contexts/authContextProvider"
import { ChatroomContext } from "@/contexts/chatroomContextProvider"
import { getJwtTokenFromStorage } from "@/utils/jwtDecoder"
import proxy from "@/utils/proxy"

export default function MessageInputContainer({
  messages,
  handleStreamMessage,
  setTempUserMessage,
  prepareRegenerate,
}: {
  messages: ChatMessage[]
  handleStreamMessage: (message: string, regenerate: boolean, chatroomIdToSend: number) => void
  setTempUserMessage: (message: string) => void
  prepareRegenerate: () => void
}) {
  const [isGenerating, setIsGenerating] = useState(false)

  const { userId, isLoad } = useContext(AuthContext)
  const { chatroomId, setChatroomId } = useContext(ChatroomContext)

  const resizeBox = () => {
    const userInputBox = document.querySelector<HTMLTextAreaElement>("#user-input-box")

    if (userInputBox !== null) {
      userInputBox.style.height = "24px"
      userInputBox.style.height = `${Math.min(userInputBox.scrollHeight, 120)}px`
    }
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

  async function generateFoodieResponse(userInputValue: string, regenerate: boolean) {
    let url = `${process.env.NEXT_PUBLIC_WS_URL}/api`
    let chatroomIdToSend = chatroomId
    if (userId === 0) {
      url += "/public-chat"
    } else {
      url += `/chat?token=${getJwtTokenFromStorage()}`

      if (chatroomIdToSend === 0) {
        const headers = {
          Authorization: getJwtTokenFromStorage(),
        }
        const res = await proxy.post("/chatrooms", undefined, { headers })
        chatroomIdToSend = res.data.response.chatroomId
        setChatroomId(chatroomIdToSend)
      }
    }

    const socket = new WebSocket(url)

    let successConnect = false

    socket.addEventListener("open", () => {
      // 서버로 메시지 전송
      successConnect = true
      let messageToSend: string
      if (userId === 0) {
        messageToSend = JSON.stringify({
          input: userInputValue,
          history: makeHistory(),
          regenerate,
        })
      } else {
        messageToSend = JSON.stringify({
          input: userInputValue,
          chatroomId: chatroomIdToSend,
          regenerate,
        })
      }
      socket.send(messageToSend)
    })

    socket.addEventListener("message", (event) => {
      const res = JSON.parse(event.data)
      switch (res.event) {
        case "text_stream": {
          handleStreamMessage(res.response, regenerate, chatroomIdToSend)
          return
        }
        case "stream_end":
          handleStreamMessage("", regenerate, chatroomIdToSend)
          break
        case "error":
          alert(res.response)
          break
        default:
          alert("서버 통신 중 오류가 발생했습니다.")
      }
      socket.close()
    })

    socket.addEventListener("close", () => {
      setIsGenerating(false)
      if (!successConnect) alert("채팅 서버에 연결할 수 없습니다!")
    })
  }

  const onRegenerateClick = () => {
    if (isGenerating) return
    setIsGenerating(true)
    prepareRegenerate()
    generateFoodieResponse("", true).then(() => {})
  }

  const onSendClick = () => {
    if (!isLoad || isGenerating) return
    const userInputBox = document.querySelector<HTMLTextAreaElement>("#user-input-box")

    const userInputValue = userInputBox!.value
    if (userInputValue) {
      setTempUserMessage(userInputValue)
      setIsGenerating(true)
      generateFoodieResponse(userInputValue, false).then(() => {})
      userInputBox!.value = ""
      resizeBox()
    }
  }

  return (
    <div className="flex justify-center">
      <div className="flex justify-center mt-3 mb-6 w-[60%] border-2 border-solid border-gray-400 rounded py-3 box-content relative focus-within:shadow-[0_0_4px_4px_rgba(0,0,0,0.1)]">
        <button
          type="button"
          className={`w-[10rem] border bg-white border-gray-400 rounded flex justify-center items-center h-9 mb-4 absolute -top-14 opacity-70 hover:opacity-100 transition${
            messages.length !== 0 && !isGenerating ? "" : " invisible"
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
            limitInputNumber(e, 500)
            resizeBox()
          }}
          onKeyDown={(e) => {
            pressEnter(e, onSendClick)
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
