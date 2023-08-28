import React, { useEffect, useState } from "react"
import Modal from "@/components/modal"
import proxy from "@/utils/proxy"
import { getJwtId, getJwtTokenFromStorage } from "@/utils/jwtDecoder"

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="w-full min-h-[45px] h-auto flex items-center">
      <div className="text-right pr-4 basis-1/4 font-bold">
        <p>{label}</p>
      </div>
      <div className="basis-3/4 pl-4 flex flex-wrap break-keep">
        <p>{value}</p>
      </div>
    </div>
  )
}

export default function ProfileModal({
  onClickClose,
  onClickEditEmail,
  onClickEditProfile,
}: {
  onClickClose(): void
  onClickEditEmail(): void
  onClickEditProfile(): void
}) {
  const [profile, setProfile] = useState({
    loginId: "",
    name: "",
    email: "",
    gender: "",
    birth: "",
    favors: "",
  })

  useEffect(() => {
    const headers = {
      Authorization: getJwtTokenFromStorage(),
    }
    proxy.get(`/users/${getJwtId()}`, { headers }).then((res) => {
      const { response } = res.data

      const favorsString = response.favors.map((favor: { id: number; foodName: string }) => favor.foodName).join(", ")

      setProfile({
        loginId: response.loginId,
        name: response.name,
        email: response.email,
        gender: response.gender ? "여성" : "남성",
        birth: response.birth,
        favors: favorsString || "없음",
      })
    })
  }, [])

  return (
    <Modal onClickClose={onClickClose} description="">
      <div className="p-4 relative h-full flex flex-col mt-6">
        <div className="grow">
          <ProfileItem label="아이디" value={profile.loginId} />
          <ProfileItem label="이름" value={profile.name} />
          <ProfileItem label="이메일" value={profile.email} />
          <ProfileItem label="성별" value={profile.gender} />
          <ProfileItem label="생년월일" value={profile.birth} />
          <ProfileItem label="선호 음식" value={profile.favors} />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-orange-400 hover:bg-main-theme text-white font-semibold rounded p-2 mr-5 h-12"
            onClick={() => {
              onClickEditEmail()
              onClickClose()
            }}
          >
            이메일 변경
          </button>
          <button
            type="button"
            className="bg-orange-400 hover:bg-main-theme text-white font-semibold rounded p-2 h-12"
            onClick={() => {
              onClickEditProfile()
              onClickClose()
            }}
          >
            회원정보 수정
          </button>
        </div>
      </div>
    </Modal>
  )
}
