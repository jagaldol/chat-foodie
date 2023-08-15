import Image from "next/image"

export default function MessageInputContainer() {
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
      <div className="flex justify-center mb-6 w-[60%] border-2 border-solid border-gray-400 rounded py-3 box-content">
        <textarea
          // TODO: 메시지 길이가 늘어나 줄바꿈이 되면 박스 크기 늘려주기 한줄에 24px
          className="w-full focus:outline-none pl-5 overflow-hidden resize-none h-6"
          placeholder="메시지를 입력해주세요"
        />
        <button type="button" className="w-10 flex justify-center items-center">
          <Image src="/svg/send.svg" alt="전송" width="16" height="16" />
        </button>
      </div>
    </div>
  )
}
