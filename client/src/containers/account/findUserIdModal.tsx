"use client"

import React, { useState } from "react"
import Modal from "@/components/modal"
import proxy from "@/utils/proxy"
import TextField from "@/components/textField"
import { limitInputNumber } from "@/utils/utils"

export default function FindUserIdModal({ onClickClose }: { onClickClose(): void }) {
  const [formData, setFormData] = useState({
    email: "",
  })
  const [errors, setErrors] = useState({
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

    return isValid
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) {
      alert("입력하신 정보를 확인해주세요")
      return
    }

    const requestData = {
      email: formData.email,
    }

    proxy
      .post(`/help/loginId`, requestData)
      .then((res) => {
        console.log(res.data.response.loginId)
        setMessage(`회원님의 아이디는 '${res.data.response.loginId}' 입니다.`)
        alert(`회원님의 아이디는 ${res.data.response.loginId} 입니다.`)
      })
      .catch((err) => {
        console.log(err.response.data.errorMessage)
        alert(err.response.data.errorMessage)
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
              message={message}
            />

            <button
              className="bg-orange-400 hover:bg-main-theme text-white font-semibold p-2 rounded w-80 h-12 max-md:w-64 max-md:h-10 max-md:font-normal"
              type="submit"
            >
              아이디 찾기
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
