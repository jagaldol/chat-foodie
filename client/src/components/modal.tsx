import React, { ReactNode, useRef } from "react"
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
  const modal = useRef<HTMLDivElement>(null)

  /**
   * 모달의 헤더를 클릭하여 모달을 움직일 수 있게 해주는 함수
   * @param {MouseDownEvent<HTMLDivElement>} e
   */
  function moveModal(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget) return
    let startX = e.clientX
    let startY = e.clientY

    const onMove = (mouseEvent: MouseEvent) => {
      const lastX = startX - mouseEvent.clientX
      const lastY = startY - mouseEvent.clientY

      startX = mouseEvent.clientX
      startY = mouseEvent.clientY

      if (modal.current) {
        modal.current.style.top = `${modal.current.offsetTop - lastY}px`
        modal.current.style.left = `${modal.current.offsetLeft - lastX}px`
      }
    }

    const onRemoveEvent = () => {
      document.removeEventListener("mouseup", onRemoveEvent)
      document.removeEventListener("mousemove", onMove)
    }

    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseup", onRemoveEvent)
  }

  return (
    <div className="bg-black/5 h-full w-full z-30 flex fixed left-0 top-0 items-center justify-center">
      <div
        ref={modal}
        className="flex fixed flex-col w-[500px] h-[650px] bg-white shadow-[3px_3px_11px_0_rgba(0,0,0,0.1)] p-5 max-md:w-[348px] max-md:h-[540px] max-md:p-3"
      >
        <div role="presentation" className="flex justify-end" onMouseDown={(e) => moveModal(e)}>
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
