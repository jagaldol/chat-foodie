import Image from "next/image"
import MessageInput from "@/containers/chat/message-input"
import { ChatMessages } from "@/types/chat"

export default function MessageInputContainer({ addMessage }: { addMessage: (message: ChatMessages) => void }) {
  return (
    <div className="flex flex-col justify-end items-center">
      <div className="flex justify-center h-9 mb-4">
        <button
          type="button"
          className="w-[10rem] border border-gray-400 rounded flex justify-center items-center hover:bg-gray-100"
        >
          <Image src="/svg/refresh.svg" alt="" width="16" height="16" />
          <p className="text-gray-500 ml-2 text-sm">답변 재생성</p>
        </button>
      </div>
      <MessageInput addMessage={addMessage} />
    </div>
  )
}
