import Image from "next/image"

function NavFooterTool({ iconSrc, text, link }: { iconSrc: string; text: string; link: string }) {
  return (
    <a className="flex mt-7 ml-2.5 items-center" href={link}>
      <Image src={iconSrc} alt="" height="16" width="16" style={{ height: "16px" }} />
      <p className="ml-2 text-sm">{text}</p>
    </a>
  )
}

export default function Navigator() {
  return (
    <nav className="flex flex-col min-w-[16rem] p-2.5 border-r-gray-200 border-r border-solid">
      <a
        type="button"
        className="border-solid border border-gray-300 rounded-md h-11 flex items-center hover:bg-gray-100 hover:border-gray-200 transition"
        href="/"
      >
        <Image src="/svg/add.svg" alt="add" height="20" width="20" className="ml-4" />
        <p className="ml-2 text-sm font-bold">새로운 대화</p>
      </a>
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
