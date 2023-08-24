import React, { useState } from "react"
import Modal from "@/components/modal"
import PreferenceModal from "@/containers/account/preferenceModal"

export default function ProfileModal({ onClickClose }: { onClickClose(): void }) {
  const [preferenceModalOpened, setPreferenceModalOpened] = useState(false)

  return (
    <>
      {preferenceModalOpened ? (
        <div className="fixed inset-0 flex items-center justify-center z-40">
          <PreferenceModal
            onClickClose={() => {
              setPreferenceModalOpened(false)
            }}
          />
        </div>
      ) : null}
      <Modal onClickClose={onClickClose} description="회원정보">
        <div className="p-4 relative">
          {/* 회원 정보 표시 */}
          {/* ... */}

          {/* 개인정보 수정 버튼 */}
          <button type="button" className="bg-main-theme text-white rounded p-2">
            개인정보 수정
          </button>

          {/* 선호도 저장 버튼 */}
          <button
            type="button"
            className="bg-main-theme text-white rounded p-2"
            onClick={() => setPreferenceModalOpened(true)}
          >
            선호도 저장
          </button>
        </div>
      </Modal>
    </>
  )
}
