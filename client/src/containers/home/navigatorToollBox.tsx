"use client"

import React from "react"
import NavFooterTool from "@/components/navfooterTool"

export default function NavigatorToolBox() {
  return (
    <>
      <NavFooterTool
        iconSrc="/svg/github.svg"
        text="View in github"
        func={() => {
          window.location.href = "https://github.com/jagaldol/chat-foodie"
        }}
      />
      <NavFooterTool
        iconSrc="/svg/envelope-solid.svg"
        text="chatfoodie2023@gmail.com"
        func={() => {
          window.location.href = "mailto:chatfoodie2023@gmail.com"
        }}
      />
    </>
  )
}
