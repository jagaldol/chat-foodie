"use client"

import { useEffect, useState } from "react"
import LoginModal from "@/containers/account/loginModal"
import { getJwtId } from "@/utils/jwtDecoder"

export default function Account() {
  const [loginModalOpened, setLoginModalOpened] = useState(false)
  const [needToUpdateAccount, setNeedToUpdateAccount] = useState(false)

  const [userId, setUserId] = useState(null)

  useEffect(() => {
    setUserId(getJwtId())
    console.log("로그인 확인")
  }, [needToUpdateAccount])

  return (
    <div className="flex flex-wrap grow justify-end items-center min-w-[20%] h-min">
      {userId ? null : (
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
          {loginModalOpened ? (
            <LoginModal
              onClickClose={() => setLoginModalOpened(false)}
              onChangeAccount={() => setNeedToUpdateAccount(!needToUpdateAccount)}
            />
          ) : null}
        </>
      )}
    </div>
  )
}
