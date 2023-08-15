"use client"

export default function MessageInput() {
  return (
    <textarea
      className="w-full focus:outline-none pl-5 custom-scroll-bar-4px overflow-y scroll resize-none h-6"
      onChange={(e) => {
        console.log(e.target.scrollHeight)
        e.target.style.height = "24px"
        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
      }}
      placeholder="메시지를 입력해주세요"
    />
  )
}
