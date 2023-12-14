import Image from "next/image"
import { Dispatch, SetStateAction, useContext, useEffect, useRef } from "react"
import { AuthContext } from "@/contexts/authContextProvider"
import { deleteJwt, getJwtTokenFromStorage } from "@/utils/jwtDecoder"
import proxy from "@/utils/proxy"

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
  const { userId, needUpdate } = useContext(AuthContext)
  const dropDownRef = useRef<HTMLDivElement>(null)

  const handleWithdraw = () => {
    if (confirm("정말로 탈퇴하시겠습니까? \n탈퇴 시 모든 정보가 삭제됩니다. \n삭제된 정보는 복구할 수 없습니다.")) {
      const headers = {
        Authorization: getJwtTokenFromStorage(),
      }
      proxy
        .delete(`/users/${userId}`, { headers })
        .then(() => {
          deleteJwt()
          needUpdate()
          alert("탈퇴되었습니다.")
        })
        .catch((err) => {
          alert(err.response.data.errorMessage)
        })
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setIsOpened(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [isOpened, setIsOpened])
  return (
    <div
      className={`absolute top-[52px] right-9 max-md:top-9 max-md:right-4 w-[180px] max-lg:w-[160px] z-20 py-2 rounded bg-gray-200 transition-all duration-300 ${
        isOpened ? "opacity-100 visible" : "opacity-0 invisible -translate-y-[4%]"
      }`}
      ref={dropDownRef}
    >
      <div className="flex flex-col items-center">
        <button
          type="button"
          className="flex flex-row gap-4 items-center justify-center text-sm text-center font-bold w-full h-[36px] p-3 min-h-[40px] hover:bg-gray-300 transition-all duration-300"
          onClick={() => {
            setProfileModalOpened(true)
            setIsOpened(false)
          }}
        >
          <Image
            className="shrink-0"
            src="/svg/user_without_bg.svg"
            alt="user_without_bg"
            width={16}
            height={16}
            style={{ height: "16px" }}
          />
          <div className="grow text-left">회원정보</div>
        </button>
        <button
          type="button"
          className="flex flex-row gap-4 items-center justify-center text-sm text-center font-bold w-full h-[36px] p-3 min-h-[40px] hover:bg-gray-300 transition-all duration-300"
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
          className="flex flex-row gap-4 items-center justify-center text-sm text-center font-bold w-full h-[36px] p-3 min-h-[40px] hover:bg-gray-300 transition-all duration-300"
          onClick={() => {
            proxy.post("/logout").then(() => deleteJwt())
            needUpdate()
            setIsOpened(false)
          }}
        >
          <Image className="shrink-0" src="/svg/logout.svg" alt="logout" width={16} height={16} />
          <div className="grow text-left">로그아웃</div>
        </button>
        <button
          type="button"
          className="flex flex-row gap-4 items-center justify-center text-sm text-center font-bold w-full h-[36px] p-3 min-h-[40px] hover:bg-red-200 hover:text-red-500 transition-all duration-300"
          onClick={() => {
            handleWithdraw()
          }}
        >
          <svg
            className="stroke-current "
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1 3H1.9L19 3" stroke="current" strokeWidth="2" strokeLinecap="round" />
            <path
              d="M3 3V17.1176C3 17.5882 3.02412 18.0855 3.43686 18.5294C3.87372 18.9993 4.3125 19 4.75 19C6.15 19 12.3333 19 15.25 19C15.6869 19 16.1237 19 16.5619 18.5294C17 18.0588 17 17.5882 17 17.1176C17 15.6118 17 7.07843 17 3"
              stroke="current"
              strokeWidth="2"
            />
            <path d="M7 8L13 14" stroke="current" strokeWidth="2" strokeLinecap="round" />
            <path d="M13 8L7 14" stroke="current" strokeWidth="2" strokeLinecap="round" />
            <path
              d="M13 2C13 1.8042 12.931 1.49339 12.7119 1.27024C12.558 1.11349 12.3301 1 12 1C11.2 1 9 1 8 1C7.79265 1 7.45631 1.07739 7.2317 1.32846C7.09523 1.481 7 1.69765 7 2"
              stroke="current"
              strokeWidth="2"
            />
          </svg>
          <div className="grow text-left">회원 탈퇴</div>
        </button>
      </div>
    </div>
  )
}
