"use client"

import Modal from "@/components/modal"

export default function EditProfileModal({ onClickClose }: { onClickClose(): void }) {
  return (
    <Modal onClickClose={onClickClose} description="">
      <div className="p-5 h-0 grow">
        <form className="overflow-y-scroll custom-scroll-bar-10px max-h-full -mr-[10px]" onSubmit={() => {}}>
          <div className="flex flex-col items-center">
            <button
              className="bg-orange-400 hover:bg-main-theme text-white font-semibold py-2 px-4 rounded w-80 h-12"
              type="submit"
            >
              정보 수정
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
