"use client"

import React, { useState, useContext } from "react"
import Modal from "@/components/modal"
import proxy from "@/utils/proxy"
import { saveJwt } from "@/utils/jwtDecoder"
import { AuthContext } from "@/contexts/authContextProvider"
import { limitInputNumber } from "@/utils/utils"

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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
            <label htmlFor="loginId" className="block w-80 h-16 mb-3">
              <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                아이디
              </span>
              <input
                type="text"
                name="loginId"
                className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-main-theme focus:ring-main-theme block w-full rounded-md sm:text-sm focus:ring-1"
                placeholder="아이디를 입력하세요"
                onChange={(e) => limitInputNumber(e, 40)}
              />
            </label>

            <label htmlFor="password" className="block w-80 h-16 mb-3">
              <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                비밀번호
              </span>
              <input
                type="password"
                name="password"
                className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-main-theme focus:ring-main-theme block w-full rounded-md sm:text-sm focus:ring-1"
                placeholder="비밀번호를 입력하세요"
                onChange={(e) => limitInputNumber(e, 64)}
              />
            </label>

            <label htmlFor="passwordCheck" className="block w-80 h-16 mb-3">
              <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                비밀번호 확인
              </span>
              <input
                type="password"
                name="passwordCheck"
                className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-main-theme focus:ring-main-theme block w-full rounded-md sm:text-sm focus:ring-1"
                placeholder="비밀번호를 입력하세요"
                onChange={(e) => limitInputNumber(e, 64)}
              />
            </label>

            <label htmlFor="passwordCheck" className="block w-80 h-16 mb-3">
              <span className="block text-sm font-medium text-slate-700">이름</span>
              <input
                type="text"
                name="name"
                className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-main-theme focus:ring-main-theme block w-full rounded-md sm:text-sm focus:ring-1"
                placeholder="이름을 입력하세요"
                onChange={(e) => limitInputNumber(e, 40)}
              />
            </label>

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

            <label htmlFor="email" className="block w-80 h-16 mb-3">
              <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                이메일
              </span>
              <input
                type="email"
                name="email"
                className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-main-theme focus:ring-main-theme block w-full rounded-md sm:text-sm focus:ring-1"
                placeholder="example@domain.com"
                onChange={(e) => limitInputNumber(e, 100)}
              />
            </label>

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
