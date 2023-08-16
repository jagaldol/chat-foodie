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
      <Modal onClickClose={onClickClose}>
        <div className="p-4 relative">
          {/* 회원 정보 표시 */}
          {/* ... */}

          {/* 개인정보 수정 버튼 */}
          <button type="button" className="bg-blue-500 text-white rounded-md px-4 py-2 mt-4">
            개인정보 수정
          </button>

          {/* 선호도 저장 버튼 */}
          <button
            type="button"
            className="bg-green-500 text-white rounded-md px-4 py-2 mt-2"
            onClick={() => setPreferenceModalOpened(true)}
          >
            선호도 저장
          </button>
        </div>
      </Modal>
    </>
  )
}
