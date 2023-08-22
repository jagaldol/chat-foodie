import Image from "next/image"
import React from "react"

function NavFooterTool({ iconSrc, text, link }: { iconSrc: string; text: string; link: string }) {
  return (
    <a className="flex mt-7 ml-2.5 items-center" href={link}>
      <Image src={iconSrc} alt="" height="16" width="16" style={{ height: "16px" }} />
      <p className="ml-2 text-sm">{text}</p>
    </a>
  )
}
export default function NavigatorToolBox() {
  return (
    <div>
      <NavFooterTool iconSrc="/svg/github.svg" text="View in github" link="https://github.com/jagaldol/chat-foodie" />
      <NavFooterTool
        iconSrc="/svg/envelope-solid.svg"
        text="chatfoodie2023@gmail.com"
        link="mailto:chatfoodie2023@gmail.com"
      />
    </div>
  )
}
