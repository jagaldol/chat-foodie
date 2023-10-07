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
import FindUserIdModal from "./findUserIdModal"
import FindUserPasswordModal from "./findUserPasswordModal"

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
  const [findUserIdModalOpened, setFindUserIdModalOpened] = useState(false)
  const [findUserPasswordModalOpened, setFindUserPasswordModalOpened] = useState(false)

  useEffect(() => {
    if (userId !== 0) {
      const headers = {
        Authorization: getJwtTokenFromStorage(),
      }
      proxy.get(`/users/${userId}`, { headers }).then((res) => {
        setUserName(res.data.response.name)
        if (userRole === "ROLE_USER" && res.data.response.favors.length === 0) {
          setPreferenceModalOpened(true)
        }
      })
    }
  }, [userId, userRole])
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
                className={`flex flex-row gap-3 max-md:gap-0 items-center h-11 w-[180px] max-lg:w-[160px] max-md:w-7 max-md:h-7 max-md:p-0 p-2 max-md:mr-4 mr-9 rounded overflow-hidden hover:bg-gray-200 transition-all duration-300 ${
                  dropDownOpened ? "bg-gray-200" : ""
                }`}
                onClick={() => {
                  setDropDownOpened(!dropDownOpened)
                }}
                type="button"
              >
                <Image className="shrink-0 rounded-sm" src="/svg/user.svg" alt="user" width={28} height={28} />

                <p className="text-left font-semibold w-[calc(100%-68px)] h-full overflow-hidden max-md:invisible max-md:w-0">
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
                <EditProfileModal onClickClose={() => setEditProfileModalOpened(false)} setUserName={setUserName} />
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
              className="flex items-center justify-center mr-16 max-md:mr-4 bg-orange-400 hover:bg-main-theme text-white rounded hover:cursor-pointer font-semibold"
              onClick={() => setLoginModalOpened(true)}
            >
              <p className="text-sm mx-2.5 my-2 max-md:mx-1.5 max-md:my-1.5 text-center max-md:text-xs">로그인</p>
            </button>
            {loginModalOpened ? (
              <LoginModal
                onClickClose={() => setLoginModalOpened(false)}
                onClickJoin={() => {
                  setLoginModalOpened(false)
                  setJoinModalOpened(true)
                }}
                onClickFindId={() => {
                  setLoginModalOpened(false)
                  setFindUserIdModalOpened(true)
                }}
                onClickFindPassword={() => {
                  setLoginModalOpened(false)
                  setFindUserPasswordModalOpened(true)
                }}
              />
            ) : null}
            {joinModalOpened ? <JoinModal onClickClose={() => setJoinModalOpened(false)} /> : null}
            {findUserIdModalOpened ? (
              <FindUserIdModal
                setFindUserPasswordModalOpened={setFindUserPasswordModalOpened}
                setLoginModalOpened={setLoginModalOpened}
                onClickClose={() => setFindUserIdModalOpened(false)}
              />
            ) : null}
            {findUserPasswordModalOpened ? (
              <FindUserPasswordModal
                setLoginModalOpened={setLoginModalOpened}
                onClickClose={() => setFindUserPasswordModalOpened(false)}
              />
            ) : null}
          </>
        )
      })()}
    </div>
  )
}
