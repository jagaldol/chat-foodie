import Image from "next/image"

function NavFooterTool({ iconSrc, text, link }: { iconSrc: string; text: string; link: string }) {
  return (
    <a className="flex mt-7 ml-2.5" href={link}>
      <Image src={iconSrc} alt="" height="16" width="16" />
      <p className="ml-2 text-sm">{text}</p>
    </a>
  )
}

export default function Navigator() {
  return (
    <nav className="flex flex-col w-64 p-2.5 border-r-gray-200 border-r border-solid">
      <div className="border-solid border border-gray-400 rounded-md h-11 flex items-center hover:cursor-pointer">
        <Image src="/svg/add.svg" alt="add" height="20" width="20" className="ml-4" />
        <p className="ml-2 text-sm font-bold">새로운 대화</p>
      </div>
      <div className="grow" />
      <div className="border-t-2 border-solid border-gray-400">
        <div>
          <NavFooterTool
            iconSrc="/svg/github.svg"
            text="View in github"
            link="https://github.com/jagaldol/chat-foodie"
          />
          <NavFooterTool
            iconSrc="/svg/envelope-solid.svg"
            text="chatfoodie2023@gmail.com"
            link="mailto:chatfoodie2023@gmail.com"
          />
        </div>
      </div>
    </nav>
  )
}
