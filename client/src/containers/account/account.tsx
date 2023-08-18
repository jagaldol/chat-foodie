"use client"

import { useContext, useEffect, useState } from "react"
import LoginModal from "@/containers/account/loginModal"
import { AuthContext } from "@/contexts/authContextProvider"
import { deleteJwt } from "@/utils/jwtDecoder"
import JoinModal from "@/containers/account/joinModal"
import ProfileModal from "@/containers/account/profileModal"
import EmailVerificationModal from "./emailVerificationModal"

export default function Account() {
  const [loginModalOpened, setLoginModalOpened] = useState(false)
  const [joinModalOpened, setJoinModalOpened] = useState(false)
  const [emailVerificationModalOpend, setEmailVerificationModalOpend] = useState(false)
  const { userId, isLoad, userRole, needUpdate } = useContext(AuthContext)
  const [profileModalOpened, setProfileModalOpened] = useState(false)

  useEffect(() => {
    if (userRole === "ROLE_PENDING") {
      setEmailVerificationModalOpend(true)
    }
  }, [userRole])

  return (
    <div className="flex flex-wrap justify-end items-center h-min">
      {(() => {
        if (!isLoad) return null
        if (userId !== 0) {
          return (
            <>
              <button
                type="button"
                className="flex items-center justify-center mr-9 my-1 bg-main-theme text-white rounded hover:cursor-pointer"
                onClick={() => setProfileModalOpened(true)}
              >
                <p className="text-sm mx-2.5 my-2 text-center">회원 정보</p>
              </button>
              {profileModalOpened ? <ProfileModal onClickClose={() => setProfileModalOpened(false)} /> : null}
              <button
                type="button"
                className="flex items-center justify-center mr-9 my-1 bg-main-theme text-white rounded hover:cursor-pointer"
                onClick={() => {
                  deleteJwt()
                  needUpdate()
                }}
              >
                <p className="text-sm mx-2.5 my-2 text-center">로그아웃</p>
              </button>
              {emailVerificationModalOpend ? (
                <EmailVerificationModal onClickClose={() => setEmailVerificationModalOpend(false)} />
              ) : null}
            </>
          )
        }
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
              onClick={() => setJoinModalOpened(true)}
            >
              <p className="text-sm mx-2.5 my-2 text-center">회원가입</p>
            </button>
            {loginModalOpened ? <LoginModal onClickClose={() => setLoginModalOpened(false)} /> : null}
            {joinModalOpened ? (
              <JoinModal
                onClickClose={() => setJoinModalOpened(false)}
                setEmailVerificationModalOpend={setEmailVerificationModalOpend}
              />
            ) : null}
          </>
        )
      })()}
    </div>
  )
}
