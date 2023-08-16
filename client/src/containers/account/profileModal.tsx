import React, { useState } from "react"
import Modal from "@/components/modal" // Modal 컴포넌트를 가져옴
import PreferenceModal from "@/containers/account/preferenceModal"

export default function ProfileModal({ onClickClose }: { onClickClose(): void }) {
  const [preferenceModalOpened, setPreferenceModalOpened] = useState(false)

  return (
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

        {/* 선호도 저장 모달 */}
        {preferenceModalOpened && (
          <div className="fixed inset-0 items-center justify-center">
            <PreferenceModal onClickClose={() => setPreferenceModalOpened(false)} />
          </div>
        )}
      </div>
    </Modal>
  )
}
