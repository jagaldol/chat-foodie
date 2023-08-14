import Image from "next/image"

export default function Navigator() {
  return (
    <nav className="w-64 p-2.5 border-r-gray-200 border-r border-solid">
      <div className="border-solid border border-gray-400 rounded-md h-11 flex items-center hover:cursor-pointer">
        <Image src="/svg/add.svg" alt="add" height="20" width="20" className="ml-4" />
        <p className="ml-2 text-sm font-bold">새로운 대화</p>
      </div>
    </nav>
  )
}
