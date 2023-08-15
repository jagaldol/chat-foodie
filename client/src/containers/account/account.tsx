"use client"

import { useContext, useState } from "react"
import LoginModal from "@/containers/account/loginModal"
import { AuthContext } from "@/contexts/authContextProvider"
import { deleteJwt } from "@/utils/jwtDecoder"

export default function Account() {
  const [loginModalOpened, setLoginModalOpened] = useState(false)
  const { userId, isLoad, needUpdate } = useContext(AuthContext)
  return (
    <div className="flex flex-wrap grow justify-end items-center min-w-[20%] h-min">
      {(() => {
        if (!isLoad) return null
        if (userId !== 0)
          return (
            <button
              type="button"
              onClick={() => {
                deleteJwt()
                needUpdate()
              }}
            >
              <p>로그아웃</p>
            </button>
          )
        return (
          <>
            <button
              type="button"
              className="flex items-center justify-center mr-9 my-1 bg-main-theme text-white rounded hover:cursor-pointer"
              onClick={() => setLoginModalOpened(true)}
            >
              <p className="text-sm mx-2.5 my-2 text-center">로그인</p>
            </button>
            <button
              type="button"
              className="flex items-center justify-center mr-9 my-1 bg-main-theme text-white rounded hover:cursor-pointer"
            >
              <p className="text-sm mx-2.5 my-2 text-center">회원가입</p>
            </button>
            {loginModalOpened ? <LoginModal onClickClose={() => setLoginModalOpened(false)} /> : null}
          </>
        )
      })()}
    </div>
  )
}
