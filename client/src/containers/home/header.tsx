import Image from "next/image"
import titleFont from "@/styles/TitleFont"
import Account from "@/containers/login/account"

export default function Header() {
  return (
    <header className="flex items-center">
      <div className="grow min-w-[20%]" />
      <div className="flex grow flex-col justify-center">
        <div className="flex items-center justify-center mr-5">
          <Image src="/svg/logo.svg" alt="logo" width={60} height={60} />
          <h1 className={`text-5xl text-main-theme font-bold ${titleFont.className}`}>Chatfoodie</h1>
        </div>
        <p className="text-sm text-center">음식 추천의 전문가 foodie와 채팅을 해보세요!</p>
      </div>
      <Account />
    </header>
  )
}
