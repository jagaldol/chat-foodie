"use client"

import { useContext, useEffect } from "react"
import Modal from "@/components/modal"
import TextField from "@/components/textField"
import { AuthContext } from "@/contexts/authContextProvider"
import { deleteJwt, getJwtTokenFromStorage, saveJwt } from "@/utils/jwtDecoder"
import { limitInputNumber } from "@/utils/utils"
import proxy from "@/utils/proxy"

export default function EmailVerificationModal({ onClickClose }: { onClickClose(): void }) {
  const { needUpdate } = useContext(AuthContext)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const headers = {
      Authorization: getJwtTokenFromStorage(),
    }
    const requestData = {
      verificationCode: e.currentTarget.querySelector<HTMLInputElement>(`[name='emailVerificationCode']`)!.value,
    }
    proxy
      .post("/email-verifications/confirm", requestData, { headers })
      .then((res) => {
        const jwt = res.headers.authorization
        saveJwt(jwt)
        alert("인증이 완료되었습니다.")
        needUpdate()
        onClickClose()
      })
      .catch((res) => {
        alert(res.response.data.errorMessage)
      })
  }

  useEffect(() => {
    const headers = {
      Authorization: getJwtTokenFromStorage(),
    }
    proxy
      .post("/email-verifications", undefined, { headers })
      .then(() => {
        alert("인증 번호가 전송되었습니다.")
      })
      .catch((res) => {
        alert(res.response.data.errorMessage)
      })
  }, [])
  return (
    <Modal
      onClickClose={() => {
        alert("로그아웃 됩니다.")
        deleteJwt()
        needUpdate()
      }}
    >
      <div className="p-5 h-0 grow">
        <form className="overflow-y-scroll custom-scroll-bar-10px max-h-full" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center">
            <TextField
              label="이메일 인증 코드"
              type="text"
              name="emailVerificationCode"
              placeholder="인증 코드를 입력하세요(6자리)"
              onChange={(e) => {
                limitInputNumber(e, 6)
              }}
              required
            />

            <button
              className="bg-orange-400 hover:bg-main-theme text-white font-semibold py-2 px-4 rounded w-80 h-12"
              type="submit"
            >
              이메일 인증하기
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
