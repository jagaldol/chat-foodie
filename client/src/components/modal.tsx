import { ReactNode } from "react"
import Image from "next/image"
import titleFont from "@/styles/TitleFont"

export default function Modal({
  children,
  onClickClose,
  description = "음식 추천의 전문가 foodie와 채팅을 해보세요!",
}: {
  children: ReactNode
  onClickClose(): void
  description?: string
}) {
  return (
    <div className="bg-black/5 h-screen w-screen z-30 flex fixed left-0 top-0 items-center justify-center">
      <div className="flex flex-col w-[500px] h-[650px] bg-white drop-shadow p-5 max-md:w-[348px] max-md:h-[540px] max-md:p-3">
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
          <div className="flex items-center justify-center">
            <Image src="/svg/logo.svg" alt="logo" width={26} height={26} />
            <p className={`text-3xl max-md:text-1x1 text-main-theme ml-1 font-bold ${titleFont.className}`}>
              Chatfoodie
            </p>
          </div>
          {description === "" ? null : <p className="text-sm max-md:text-xs text-center">{description}</p>}
        </div>
        <div className="flex flex-col grow">{children}</div>
      </div>
    </div>
  )
}
