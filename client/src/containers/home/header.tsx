import Image from "next/image"

export default function Header() {
  return (
    <header className="flex grow mt-7 items-center">
      <div className="grow min-w-[20%]" />
      <div className="flex grow-[6] flex-col justify-center">
        <div className="flex items-center justify-center">
          <Image src="/svg/logo.svg" alt="logo" width={60} height={60} />
          <h1 className="text-5xl text-main-theme font-bold">Chatfoodie</h1>
        </div>
        <p className="text-sm text-center ml-5">
          음식 추천의 전문가 foodie와 채팅을 해보세요!
        </p>
      </div>
      <div className="flex flex-wrap grow justify-end items-center min-w-[20%] h-min">
        <div className="flex items-center justify-center mr-9 my-1 bg-main-theme text-white rounded hover:cursor-pointer">
          <p className="text-sm mx-2.5 my-2 text-center">로그인</p>
        </div>
        <div className="flex items-center justify-center mr-9 my-1 bg-main-theme text-white rounded hover:cursor-pointer">
          <p className="text-sm mx-2.5 my-2 text-center">회원가입</p>
        </div>
      </div>
    </header>
  )
}
