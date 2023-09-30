"use client"

import React, { useState } from "react"
import Modal from "@/components/modal"
import proxy from "@/utils/proxy"
import { limitInputNumber } from "@/utils/utils"
import TextField from "@/components/textField"

export default function FindUserPasswordModal({ onClickClose }: { onClickClose(): void }) {
  const [formData, setFormData] = useState({
    loginId: "",
    email: "",
  })
  const [errors, setErrors] = useState({
    loginId: "",
    email: "",
  })
  const [message, setMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const validateLoginId = async () => {
    const newErrors = { ...errors }
    let isValid = true

    if (formData.loginId.trim() === "") {
      newErrors.loginId = "아이디를 입력해주세요."
      isValid = false
    }

    setErrors((prev) => ({ ...prev, loginId: newErrors.loginId }))
    return isValid
  }

  const validateEmail = async () => {
    const newErrors = { ...errors }
    let isValid = true

    if (formData.email.trim() === "") {
      newErrors.email = "이메일을 입력해주세요."
      isValid = false
    } else if (!/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(formData.email)) {
      newErrors.email = "올바른 이메일 주소를 입력해주세요."
      isValid = false
    } else if (formData.email.length > 100) {
      newErrors.email = "이메일은 최대 100자 이하여야 합니다."
      isValid = false
    } else {
      newErrors.email = ""
    }
    setErrors((prev) => ({ ...prev, email: newErrors.email }))
    return isValid
  }

  const validateForm = async () => {
    let isValid = true
    isValid = (await validateEmail()) && isValid
    isValid = (await validateLoginId()) && isValid

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!(await validateForm())) {
      alert("입력하신 정보를 확인해주세요")
      return
    }

    const requestData = {
      loginId: formData.loginId,
      email: formData.email,
    }

    proxy.post(`/help/password`, requestData).then((res) => {
      console.log(res.data.response.loginId)
      setMessage(`회원님의 아이디는 '${res.data.response.loginId}' 입니다.`)
      alert(`회원님의 아이디는 ${res.data.response.loginId} 입니다.`)
    })
  }
  return (
    <Modal onClickClose={onClickClose}>
      <div className="p-5 h-0 grow max-md:p-3">
        <form
          className="overflow-y-scroll custom-scroll-bar-10px max-h-full -mr-[10px] max-md:custom-scroll-bar-4px max-md:-mr-[4px]"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col items-center">
            <TextField
              label="아이디"
              type="text"
              name="loginId"
              placeholder="아이디를 입력하세요"
              required
              onChange={(e) => {
                limitInputNumber(e, 40)
                handleChange(e)
              }}
              onBlur={() => validateLoginId()}
              error={errors.loginId}
              autoComplete="username"
            />
            <TextField
              label="이메일"
              type="text"
              name="email"
              placeholder="가입하신 이메일을 입력해주세요."
              required
              onChange={(e) => {
                limitInputNumber(e, 100)
                handleChange(e)
              }}
              onBlur={() => validateEmail()}
              error={errors.email}
              autoComplete="email"
            />

            <button
              className="bg-orange-400 hover:bg-main-theme text-white font-semibold p-2 rounded w-80 h-12 max-md:w-64 max-md:h-10 max-md:font-normal"
              type="submit"
            >
              비밀번호 초기화
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
