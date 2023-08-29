"use client"

import { useContext, useState } from "react"
import Modal from "@/components/modal"
import proxy from "@/utils/proxy"
import { saveJwt } from "@/utils/jwtDecoder"
import { AuthContext } from "@/contexts/authContextProvider"
import TextField from "@/components/textField"
import { limitInputNumber } from "@/utils/utils"

export default function LoginModal({ onClickClose, onClickJoin }: { onClickClose(): void; onClickJoin(): void }) {
  const { needUpdate } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    loginId: "",
    password: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const validateLoginId = () => {
    let isValid = true
    if (formData.loginId.trim() === "") {
      setError("아이디를 입력해주세요.")
      isValid = false
    }

    return isValid
  }

  const validatePassword = () => {
    let isValid = true

    if (formData.password === "") {
      setError("비밀번호를 입력해주세요.")
      isValid = false
    }

    return isValid
  }

  const validateForm = async () => {
    if (!validateLoginId()) return false
    if (!validatePassword()) return false

    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!(await validateForm())) {
      return
    }

    proxy
      .post("/login", {
        loginId: formData.loginId,
        password: formData.password,
      })
      .then((res) => {
        const jwt = res.headers.authorization
        saveJwt(jwt)
        needUpdate()
        onClickClose()
      })
      .catch(() => {
        setError("아이디 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.")
      })
  }

  return (
    <Modal onClickClose={onClickClose}>
      <div className="p-5 h-0 grow">
        <form className="max-h-full" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center">
            <TextField
              label="아이디"
              type="text"
              name="loginId"
              placeholder="아이디를 입력하세요"
              onChange={(e) => {
                limitInputNumber(e, 40)
                handleChange(e)
              }}
            />
            <TextField
              label="비밀번호"
              type="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              onChange={(e) => {
                limitInputNumber(e, 64)
                handleChange(e)
              }}
              error={error}
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
