import { ReactNode } from "react"
import Image from "next/image"
import titleFont from "@/styles/TitleFont"

export default function Modal({
  children,
  onClickClose,
  description,
}: {
  children: ReactNode
  onClickClose(): void
  description?: string
}) {
  return (
    <div className="bg-black/5 h-screen w-screen z-30 flex fixed left-0 top-0 items-center justify-center">
      <div className="w-[500px] h-[650px] bg-white drop-shadow p-5">
        <div className="flex justify-end">
          <Image
            src="/svg/close.svg"
            alt="close"
            height={36}
            width={36}
            className="hover:cursor-pointer"
            onClick={onClickClose}
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-center justify-center mr-5">
            <Image src="/svg/logo.svg" alt="logo" width={36} height={36} />
            <h1 className={`text-3xl text-main-theme font-bold ${titleFont.className}`}>Chatfoodie</h1>
          </div>
          {description === "" ? null : <p className="text-sm text-center">{description}</p>}
        </div>
        <div className="p-10">{children}</div>
      </div>
    </div>
  )
}

Modal.defaultProps = {
  description: "음식 추천의 전문가 foodie와 채팅을 해보세요!",
}
