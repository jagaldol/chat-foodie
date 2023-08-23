"use client"

export default function DropDown({ isOpened }: { isOpened: boolean }) {
  return (
    <div
      className={`absolute top-0 right-0 mr-9 mt-[85px] w-35 z-40 bg-[#C5C5D1] rounded p-2.5 transition-all duration-300 ${
        isOpened
          ? "opacity-100 visible"
          : "opacity-0 invisible scale-y-0 scale-x-0 -translate-y-[50%] translate-x-[50%]"
      }`}
    >
      <div className="flex flex-col space-y-1 ">
        <button type="button" className="text-sm text-center text-white bg-main-theme w-[120px] h-[36px] rounded p-2">
          개인정보 변경
        </button>
        <button type="button" className="text-sm text-center text-white bg-main-theme w-[120px] h-[36px] rounded p-2 ">
          선호 음식 변경
        </button>
        <button type="button" className="text-sm text-center text-white bg-main-theme w-[120px] h-[36px] rounded p-2 ">
          로그아웃
        </button>
      </div>
    </div>
  )
}
