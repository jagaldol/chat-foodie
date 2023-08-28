"use client"

import Image from "next/image"
import { useContext, useEffect, useState } from "react"
import EmailVerificationModal from "@/containers/account/emailVerificationModal"
import LoginModal from "@/containers/account/loginModal"
import { AuthContext } from "@/contexts/authContextProvider"
import JoinModal from "@/containers/account/joinModal"
import ProfileModal from "@/containers/account/profileModal"
import DropDown from "@/containers/account/dropDown"
import proxy from "@/utils/proxy"
import { getJwtTokenFromStorage } from "@/utils/jwtDecoder"
import EditProfileModal from "@/containers/account/editProfileModal"
import PreferenceModal from "./preferenceModal"

export default function Account() {
  const { userId, isLoad, userRole } = useContext(AuthContext)
  const [loginModalOpened, setLoginModalOpened] = useState(false)
  const [joinModalOpened, setJoinModalOpened] = useState(false)
  const [emailVerificationModalOpened, setEmailVerificationModalOpened] = useState(false)
  const [profileModalOpened, setProfileModalOpened] = useState(false)
  const [dropDownOpened, setDropDownOpened] = useState(false)
  const [preferenceModalOpened, setPreferenceModalOpened] = useState(false)
  const [editProfileModalOpened, setEditProfileModalOpened] = useState(false)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    if (userId !== 0) {
      const headers = {
        Authorization: getJwtTokenFromStorage(),
      }
      proxy.get(`/users/${userId}`, { headers }).then((res) => {
        setUserName(res.data.response.name)
      })
    }
  }, [userId])
  useEffect(() => {
    if (isLoad) {
      if (userId !== 0 && userRole === "ROLE_PENDING") {
        setEmailVerificationModalOpened(true)
      } else if (userId !== 0 && userRole === "ROLE_USER") {
        setEmailVerificationModalOpened(false)
      }
    }
  }, [isLoad, userId, userRole])

  return (
    <div className="flex flex-wrap justify-end items-center h-min relative">
      {(() => {
        if (!isLoad) return null
        if (userId !== 0) {
          return (
            <>
              <button
                className={`flex flex-row gap-3 max-md:gap-0 items-center h-11 w-[180px] max-lg:w-[160px] max-md:w-11 p-2 mr-9 rounded overflow-hidden hover:bg-gray-200 transition-all duration-300 ${
                  dropDownOpened ? "bg-gray-200" : ""
                }`}
                onClick={() => {
                  setDropDownOpened(!dropDownOpened)
                }}
                type="button"
              >
                <Image className="shrink-0 rounded-sm" src="/svg/user.svg" alt="user" width={28} height={28} />

                <p className="text-left font-bold w-[calc(100%-68px)] overflow-hidden max-md:invisible max-md:w-0 break-keep">
                  {userName}
                </p>

                <Image
                  className="shrink-0 max-md:w-0 max-md:invisible"
                  src="/svg/dots.svg"
                  alt="dots"
                  width={24}
                  height={24}
                />
              </button>

              {profileModalOpened ? (
                <ProfileModal
                  onClickClose={() => setProfileModalOpened(false)}
                  onClickEditEmail={() => setEmailVerificationModalOpened(true)}
                  onClickEditProfile={() => setEditProfileModalOpened(true)}
                />
              ) : null}
              {editProfileModalOpened ? (
                <EditProfileModal onClickClose={() => setEditProfileModalOpened(false)} />
              ) : null}
              {emailVerificationModalOpened ? (
                <EmailVerificationModal onClickClose={() => setEmailVerificationModalOpened(false)} />
              ) : null}
              {preferenceModalOpened ? <PreferenceModal onClickClose={() => setPreferenceModalOpened(false)} /> : null}

              <DropDown
                isOpened={dropDownOpened}
                setIsOpened={setDropDownOpened}
                setPreferenceModalOpened={setPreferenceModalOpened}
                setProfileModalOpened={setProfileModalOpened}
              />
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
            {joinModalOpened ? <JoinModal onClickClose={() => setJoinModalOpened(false)} /> : null}
          </>
        )
      })()}
    </div>
  )
}
