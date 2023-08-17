import Image from "next/image"
import { ChatMessage } from "@/types/chat"
import { limitInputNumber, pressEnter } from "@/utils/utils"
import { scrollDownChatBox } from "@/containers/chat/message-box-list"

export default function MessageInputContainer({ addMessage }: { addMessage: (message: ChatMessage) => void }) {
  const resizeBox = (e: any) => {
    e.target.style.height = "24px"
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
  }

  const onSendClick = () => {
    const userInputBox = document.getElementById("user-input-box") as HTMLTextAreaElement

    if (userInputBox.value) {
      const userMessage: ChatMessage = {
        id: 0,
        content: userInputBox.value,
        isFromChatbot: false,
      }
      addMessage(userMessage)
      scrollDownChatBox()
      // 서버 요청 하기??
      const chatbotMessage: ChatMessage = {
        id: 0,
        content: userInputBox.value,
        isFromChatbot: true,
      }
      addMessage(chatbotMessage)

      userInputBox.value = ""
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
