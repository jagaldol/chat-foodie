"use client"

import { useState } from "react"
import Modal from "@/components/modal"

export default function AnnounceModal() {
  const [isOpen, setIsOpen] = useState(true)
  return (
    isOpen && (
      <Modal onClickClose={() => setIsOpen(false)} description="">
        <div className="px-8 py-32 max-md:py-24 max-md:text-sm flex flex-col gap-3">
          <p className="">현재 foodie AI server는 비용 상의 문제로 운영되고 있지 않습니다.</p>

          <p>AI foodie와의 대화를 나누고 싶다면 개발자 이메일로 문의 부탁드립니다. 일정시간 foodie를 깨워드립니다!</p>
          <p>
            문의하기:{" "}
            <a className="text-blue-600 hover:text-blue-800" href="jagaldol.dev@gmail.com">
              jagaldol.dev@gmail.com
            </a>
          </p>
        </div>
      </Modal>
    )
  )
}
