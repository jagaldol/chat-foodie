import Image from "next/image"
import { limitInputNumber, pressEnter } from "@/utils/utils"
import { ChatMessages } from "@/types/chat"

export default function MessageInput({ addMessage }: { addMessage: (message: ChatMessages) => void }) {
  return (
    <div className="flex justify-center mb-6 w-[60%] border-2 border-solid border-gray-400 rounded py-3 box-content">
      <textarea
        className="w-full focus:outline-none pl-5 custom-scroll-bar-4px overflow-y scroll resize-none h-6"
        id="user-input-box"
        onChange={(e) => {
          e.target.style.height = "24px"
          e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
          limitInputNumber(e, 500)
        }}
        onKeyDown={(e) => pressEnter(e, () => {})}
        placeholder="메시지를 입력해주세요"
      />
      <button
        type="button"
        className="w-10 flex justify-center items-center"
        onClick={() => {
          const userInputBox = document.getElementById("user-input-box") as HTMLTextAreaElement
          const userMessage: ChatMessages = {
            id: 0,
            content: userInputBox.value,
            isFromChatbot: false,
          }
          addMessage(userMessage)
          // 서버 요청 하기??
          const chatbotMessage: ChatMessages = {
            id: 0,
            content: userInputBox.value,
            isFromChatbot: true,
          }
          addMessage(chatbotMessage)
        }}
      >
        <Image src="/svg/send.svg" alt="전송" width="16" height="16" />
      </button>
    </div>
  )
}
