import "@/styles/globals.css"
import Image from "next/image"

export default function Header() {
  return (
    <header className="flex grow justify-center">
      <div className="flex items-center">
        <Image src="/svg/logo.svg" alt="logo" width={60} height={60} />
        <h1 className="text-5xl text-main-theme font-bold">Chatfoodie</h1>
      </div>
    </header>
  )
}
