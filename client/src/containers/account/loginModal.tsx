"use client"

import { MouseEventHandler } from "react"
import Modal from "@/components/modal"
import proxy from "@/utils/proxy"

export default function LoginModal({ onClickClose }: { onClickClose: MouseEventHandler }) {
  const content = (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const idInput = e.currentTarget.querySelector("[name='id']") as HTMLInputElement
        const id = idInput.value
        const passwordInput = e.currentTarget.querySelector("[name='password']") as HTMLInputElement
        const password = passwordInput.value
        console.log(id)
        console.log(password)
        proxy.get("/foods/random", { params: { size: 30 } }).then((res) => {
          console.log(res)
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
  )

  return <Modal content={content} onClickClose={onClickClose} />
}
