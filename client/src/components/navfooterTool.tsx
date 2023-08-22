"use client"

import Image from "next/image"
import React from "react"

export default function NavFooterTool({ iconSrc, text, func }: { iconSrc: string; text: string; func: () => void }) {
  return (
    <button type="button" className="flex mt-7 ml-2.5 items-center" onClick={func}>
      <Image src={iconSrc} alt="" height="16" width="16" style={{ height: "16px" }} />
      <p className="ml-2 text-sm">{text}</p>
    </button>
  )
}
