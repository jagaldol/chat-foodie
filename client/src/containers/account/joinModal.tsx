"use client"

import React, { useState, useContext } from "react"
import Modal from "@/components/modal"
import proxy from "@/utils/proxy"
import { saveJwt } from "@/utils/jwtDecoder"
import { AuthContext } from "@/contexts/authContextProvider"
import { limitInputNumber } from "@/utils/utils"
import TextField from "@/components/TextField"

const daysInMonth: any = {
  1: 31,
  2: 28,
  3: 31,
  4: 30,
  5: 31,
  6: 30,
  7: 31,
  8: 31,
  9: 30,
  10: 31,
  11: 30,
  12: 31,
}

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

function generateDayOptions(year: number, month: number) {
  const maxDays = month === 2 && isLeapYear(year) ? 29 : daysInMonth[month]
  const options = []
  for (let i = 1; i <= maxDays; i += 1) {
    options.push(
      <option key={i} value={i}>
        {i}
      </option>,
    )
  }
  return options
}

function generateYearOptions() {
  const options = []
  const minYear = 1900
  const maxYear = new Date().getFullYear()
  for (let i = minYear; i <= maxYear; i += 1) {
    options.push(
      <option key={i} value={i}>
        {i}
      </option>,
    )
  }
  return options
}

export default function JoinModal({ onClickClose }: { onClickClose(): void }) {
  const [selectedMonth, setSelectedMonth] = useState(1)
  const [selectedYear, setSelectedYear] = useState(2000)
  const { needUpdate } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    loginId: "",
    password: "",
    passwordCheck: "",
    name: "",
    email: "",
  })
  const [errors, setErrors] = useState({
    loginId: "",
    password: "",
    passwordCheck: "",
    name: "",
    email: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = { ...errors }

    if (formData.loginId.trim() === "") {
      newErrors.loginId = "아이디를 입력해주세요."
      isValid = false
    } else if (formData.loginId.length < 4 || formData.loginId.length > 40) {
      newErrors.loginId = "아이디는 최소 4자 이상 최대 40자 이하이어야 합니다."
      isValid = false
    } else if (!/^[a-zA-Z0-9_.]+$/.test(formData.loginId)) {
      newErrors.loginId = "영어, 숫자, _, . 만 가능합니다."
      isValid = false
    } else {
      newErrors.loginId = ""
    }

    if (formData.password === "") {
      newErrors.password = "비밀번호를 입력해주세요."
      isValid = false
    } else if (formData.password.length < 8 || formData.password.length > 64) {
      newErrors.password = "비밀번호는 최소 8자 이상 최대 64자 이하이어야 합니다."
      isValid = false
    } else if (!/^(?=.*[a-zA-Z])(?=.*[\d@#$%^&!])[a-zA-Z\d@#$%^&!]+$/.test(formData.password)) {
      newErrors.password = "영문, 숫자, 특수문자 중 최소 2종류를 포함해야 합니다."
      isValid = false
    } else {
      newErrors.password = ""
    }

    if (formData.passwordCheck !== formData.password) {
      newErrors.passwordCheck = "비밀번호가 일치하지 않습니다."
      isValid = false
    } else {
      newErrors.passwordCheck = ""
    }

    if (formData.name.length > 40) {
      newErrors.name = "이름은 최대 40자 이하여야 합니다."
      isValid = false
    } else {
      newErrors.name = ""
    }

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

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) return
    const inputFields = [
      "loginId",
      "password",
      "passwordCheck",
      "name",
      "gender",
      "birthYear",
      "birthMonth",
      "birthDay",
      "email",
    ]
    const fieldValues: Record<string, string> = {}
    inputFields.forEach((fieldName) => {
      const input = e.currentTarget.querySelector<HTMLInputElement>(`[name='${fieldName}']`)
      if (input) {
        fieldValues[fieldName] = input.value
      }
    })
    const birthDate = `${fieldValues.birthYear}-${fieldValues.birthMonth}-${fieldValues.birthDay}`

    proxy
      .post("/join", {
        loginId: fieldValues.loginId,
        password: fieldValues.password,
        passwordCheck: fieldValues.passwordCheck,
        name: fieldValues.name,
        gender: fieldValues.gender,
        birth: birthDate,
        email: fieldValues.email,
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
  }
  return (
    <Modal onClickClose={onClickClose}>
      <div className="h-0 grow">
        <form className="overflow-y-scroll custom-scroll-bar-12px max-h-full" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center">
            <TextField
              label="아이디"
              type="text"
              name="loginId"
              placeholder="아이디를 입력하세요"
              onChange={(e) => {
                limitInputNumber(e, 40)
                handleChange(e)
                validateForm()
              }}
              required
              error={errors.loginId}
            />

            <TextField
              label="비밀번호"
              type="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              required
              onChange={(e) => {
                limitInputNumber(e, 64)
                handleChange(e)
                validateForm()
              }}
              error={errors.password}
            />

            <TextField
              label="비밀번호 확인"
              type="password"
              name="passwordCheck"
              placeholder="비밀번호를 입력하세요"
              required
              onChange={(e) => {
                limitInputNumber(e, 64)
                handleChange(e)
                validateForm()
              }}
              error={errors.passwordCheck}
            />

            <TextField
              label="이름"
              type="text"
              name="name"
              placeholder="이름을 입력하세요"
              onChange={(e) => {
                limitInputNumber(e, 40)
                handleChange(e)
                validateForm()
              }}
              error={errors.name}
            />

            <label htmlFor="gender" className="block w-80 h-16 mb-3">
              <span className="block text-sm font-medium text-slate-700">성별</span>
              <select
                name="gender"
                className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-main-theme focus:ring-main-theme block w-full rounded-md sm:text-sm focus:ring-1"
              >
                <option value="false">남성</option>
                <option value="true">여성</option>
              </select>
            </label>

            <label htmlFor="birthDate" className="block w-80 h-16 mb-3">
              <span className="block text-sm font-medium text-slate-700">생년월일</span>
              <div className="flex space-x-2 mt-1">
                <select
                  name="birthYear"
                  className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-main-theme focus:ring-main-theme block w-51 rounded-md sm:text-sm focus:ring-1"
                  placeholder="년도"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                >
                  {generateYearOptions()}
                </select>
                <p className=" py-2 ">년</p>
                <select
                  name="birthMonth"
                  className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-main-theme focus:ring-main-theme block w-1/3 rounded-md sm:text-sm focus:ring-1"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
                <p className=" py-2 ">월</p>
                <select
                  name="birthDay"
                  className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-main-theme focus:ring-main-theme block w-1/3 rounded-md sm:text-sm focus:ring-1"
                >
                  {generateDayOptions(selectedYear, selectedMonth)}
                </select>
                <p className=" py-2 ">일</p>
              </div>
            </label>

            <TextField
              label="이메일"
              type="text"
              name="email"
              placeholder="example@domain.com"
              required
              onChange={(e) => {
                limitInputNumber(e, 100)
                handleChange(e)
                validateForm()
              }}
              error={errors.email}
            />

            <button
              className="bg-orange-400 hover:bg-main-theme text-white font-semibold py-2 px-4 rounded w-80"
              type="submit"
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}