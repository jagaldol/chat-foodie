import Image from "next/image"
import titleFont from "@/styles/TitleFont"
import Account from "@/containers/account/account"

export default function Header() {
  return (
    <header className="flex items-center">
      <div className="basis-1/3" />
      <div className="basis-1/3 flex flex-col justify-center">
        <a className="flex items-center justify-center" href="/">
          <div className="mt-1 min-w-fit">
            <Image src="/svg/logo.svg" alt="logo" width={36} height={36} />
          </div>
          <h1 className={`text-5xl max-md:text-4xl text-main-theme font-bold ml-1 ${titleFont.className}`}>
            Chatfoodie
          </h1>
        </a>
        <p className="text-sm max-md:text-xs text-center whitespace-nowrap">
          음식 추천의 전문가 foodie와 채팅을 해보세요!
        </p>
      </div>
      <div className="basis-1/3">
        <Account />
      </div>
    </header>
  )
}
