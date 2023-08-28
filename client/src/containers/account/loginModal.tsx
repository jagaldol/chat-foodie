"use client"

import { useContext } from "react"
import Modal from "@/components/modal"
import proxy from "@/utils/proxy"
import { saveJwt } from "@/utils/jwtDecoder"
import { AuthContext } from "@/contexts/authContextProvider"
import TextField from "@/components/textField"
import { limitInputNumber } from "@/utils/utils"

export default function LoginModal({ onClickClose, onClickJoin }: { onClickClose(): void; onClickJoin(): void }) {
  const { needUpdate } = useContext(AuthContext)

  return (
    <Modal onClickClose={onClickClose}>
      <div className="p-5 h-0 grow">
        <form
          className="max-h-full"
          onSubmit={(e) => {
            e.preventDefault()
            const idInput = e.currentTarget.querySelector<HTMLInputElement>("[name='loginId']")
            const id = idInput!.value
            const passwordInput = e.currentTarget.querySelector<HTMLInputElement>("[name='password']")
            const password = passwordInput!.value
            proxy
              .post("/login", {
                loginId: id,
                password,
              })
              .then((res) => {
                const jwt = res.headers.authorization
                saveJwt(jwt)
                needUpdate()
                onClickClose()
              })
              .catch((res) => {
                alert(res.response.data.errorMessage)
              })
          }}
        >
          <div className="flex flex-col items-center">
            <TextField
              label="아이디"
              type="text"
              name="loginId"
              placeholder="아이디를 입력하세요"
              onChange={(e) => limitInputNumber(e, 40)}
            />
            <TextField
              label="비밀번호"
              type="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              onChange={(e) => limitInputNumber(e, 64)}
            />
            <div className="flex justify-center">
              <button
                className="bg-orange-400 hover:bg-main-theme text-white font-semibold py-2 px-4 rounded w-80 h-12 max-md:w-64 max-md:h-10 max-md:font-normal"
                type="submit"
              >
                로그인
              </button>
            </div>
            <div>
              <div className="flex mt-3">
                <p className="max-md:text-xs mr-2">계정이 없으신가요?</p>
                <button type="button" onClick={onClickJoin}>
                  <p className="max-md:text-xs underline">회원가입하기</p>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  )
}
