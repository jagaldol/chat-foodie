"use client"

import Modal from "@/components/modal"
import proxy from "@/utils/proxy"
import { saveJwt } from "@/utils/jwtDecoder"

export default function LoginModal({
  onClickClose,
  onChangeAccount,
}: {
  onClickClose(): void
  onChangeAccount(): void
}) {
  return (
    <Modal onClickClose={onClickClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const idInput = e.currentTarget.querySelector("[name='id']") as HTMLInputElement
          const id = idInput.value
          const passwordInput = e.currentTarget.querySelector("[name='password']") as HTMLInputElement
          const password = passwordInput.value
          proxy
            .post("/login", {
              loginId: id,
              password,
            })
            .then((res) => {
              const jwt = res.headers.authorization
              saveJwt(jwt)
              alert("로그인 성공")
              onChangeAccount()
              onClickClose()
            })
            .catch((res) => {
              alert(res.response.data.errorMessage)
            })
        }}
      >
        <label className="flex items-center" htmlFor="id">
          <p className="mr-9 w-12">ID</p>
          <input name="id" className="grow border border-solid border-black rounded my-3" />
        </label>
        <label className="flex items-center" htmlFor="password">
          <p className="mr-9 w-12">Password</p>
          <input name="password" className="grow border border-solid border-black rounded my-3" />
        </label>
        <div className="flex justify-center m">
          <button
            className="w-full bg-main-theme text-white px-3 py-1 rounded"
            type="submit"
            onClick={() => {}}
            value="버튼"
          >
            로그인
          </button>
        </div>
      </form>
    </Modal>
  )
}
