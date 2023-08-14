"use client"

import { MouseEventHandler } from "react"
import Modal from "@/components/modal"

export default function LoginModal({ onClickClose }: { onClickClose: MouseEventHandler }) {
  const content = <div>login입니다.</div>

  return <Modal content={content} onClickClose={onClickClose} />
}
