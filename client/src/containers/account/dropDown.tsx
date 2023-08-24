import Image from "next/image"
import { Dispatch, SetStateAction, useContext, useEffect } from "react"
import { AuthContext } from "@/contexts/authContextProvider"
import { deleteJwt } from "@/utils/jwtDecoder"

export default function DropDown({
  isOpened,
  setIsOpened,
  setPreferenceModalOpened,
  setProfileModalOpened,
}: {
  isOpened: boolean
  setIsOpened: Dispatch<SetStateAction<boolean>>
  setPreferenceModalOpened: Dispatch<SetStateAction<boolean>>
  setProfileModalOpened: Dispatch<SetStateAction<boolean>>
}) {
  const { needUpdate } = useContext(AuthContext)
  useEffect(() => {
    const handleClick = () => {
      if (isOpened) setIsOpened(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => {
      document.removeEventListener("mousedown", handleClick)
    }
  }, [isOpened, setIsOpened])
  return (
    <div
      className={`absolute top-0 right-0 mr-9 mt-24 w-[180px] z-20 py-2 rounded bg-gray-200 transition-all duration-300 ${
        isOpened ? "opacity-100 visible" : "opacity-0 invisible -translate-y-[4%]"
      }`}
    >
      <div className="flex flex-col items-center">
        <button
          type="button"
          className="flex flex-row gap-4 items-center justify-center text-sm text-center font-bold w-full h-[36px] p-3 min-h-[40px] hover:bg-gray-300"
          onClick={() => {
            setProfileModalOpened(true)
            setIsOpened(false)
          }}
        >
          <Image className="shrink-0" src="/svg/user_without_bg.svg" alt="user_without_bg" width={16} height={16} />
          <div className="grow text-left">회원정보</div>
        </button>
        <button
          type="button"
          className="flex flex-row gap-4 items-center justify-center text-sm text-center font-bold w-full h-[36px] p-3 min-h-[40px] hover:bg-gray-300"
          onClick={() => {
            setPreferenceModalOpened(true)
            setIsOpened(false)
          }}
        >
          <Image className="shrink-0" src="/svg/edit.svg" alt="edit" width={16} height={16} />
          <div className="grow text-left">선호 음식 변경</div>
        </button>
        <button
          type="button"
          className="flex flex-row gap-4 items-center justify-center text-sm text-center font-bold w-full h-[36px] p-3 min-h-[40px] hover:bg-gray-300"
          onClick={() => {
            deleteJwt()
            needUpdate()
            setIsOpened(false)
          }}
        >
          <Image className="shrink-0" src="/svg/logout.svg" alt="logout" width={16} height={16} />
          <div className="grow text-left">로그아웃</div>
        </button>
      </div>
    </div>
  )
}
