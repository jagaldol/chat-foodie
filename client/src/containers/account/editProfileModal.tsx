"use client"

import { useState, useEffect, useContext, Dispatch, SetStateAction } from "react"
import Modal from "@/components/modal"
import TextField from "@/components/textField"
import proxy from "@/utils/proxy"
import { generateDayOptions, generateYearOptions, limitInputNumber } from "@/utils/utils"
import { AuthContext } from "@/contexts/authContextProvider"
import { getJwtTokenFromStorage } from "@/utils/jwtDecoder"

export default function EditProfileModal({
  onClickClose,
  setUserName,
}: {
  onClickClose(): void
  setUserName: Dispatch<SetStateAction<string>>
}) {
  const { userId, needUpdate } = useContext(AuthContext)
  const [selectedYear, setSelectedYear] = useState(2000)
  const [selectedMonth, setSelectedMonth] = useState(1)
  const [selectedDay, setSelectedDay] = useState(1)
  const [errors, setErrors] = useState({
    loginId: "",
    password: "",
    passwordCheck: "",
    name: "",
  })
  const [profile, setProfile] = useState({
    loginId: "",
    password: "",
    passwordCheck: "",
    name: "",
    gender: "false",
    birthDate: "",
  })
  const [modifiedProfile, setModifiedProfile] = useState({
    loginId: "",
    password: "",
    passwordCheck: "",
    name: "",
    gender: "false",
    birthDate: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setModifiedProfile((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setModifiedProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateLoginId = async () => {
    const newErrors = { ...errors }
    let isValid = true
    if (modifiedProfile.loginId.trim() === "") {
      newErrors.loginId = ""
    } else if (modifiedProfile.loginId.length < 4 || modifiedProfile.loginId.length > 40) {
      newErrors.loginId = "아이디는 최소 4자 이상 최대 40자 이하이어야 합니다."
      isValid = false
    } else if (!/^[a-zA-Z0-9_.]+$/.test(modifiedProfile.loginId)) {
      newErrors.loginId = "영어, 숫자, _, . 만 가능합니다."
      isValid = false
    } else {
      const requestData = {
        loginId: modifiedProfile.loginId,
      }
      try {
        if (profile.loginId !== modifiedProfile.loginId) {
          await proxy.post("/validate/loginId", requestData)
          newErrors.loginId = ""
        }
      } catch (e: any) {
        if (e.response.data.status === 461) {
          isValid = false
          newErrors.loginId = "이미 존재하는 아이디 입니다."
        }
      }
    }

    setErrors((prev) => ({ ...prev, loginId: newErrors.loginId }))
    return isValid
  }

  const validatePassword = () => {
    const newErrors = { ...errors }
    let isValid = true

    if (modifiedProfile.password === "") {
      newErrors.password = ""
    } else if (modifiedProfile.password.length < 8 || modifiedProfile.password.length > 64) {
      newErrors.password = "비밀번호는 최소 8자 이상 최대 64자 이하이어야 합니다."
      isValid = false
    } else if (!/^(?=.*[a-zA-Z])(?=.*[\d@#$%^&!])[a-zA-Z\d@#$%^&!]+$/.test(modifiedProfile.password)) {
      newErrors.password = "영문, 숫자, 특수문자 중 최소 2종류를 포함해야 합니다."
      isValid = false
    } else {
      newErrors.password = ""
    }

    setErrors((prev) => ({ ...prev, password: newErrors.password }))
    return isValid
  }

  const validatePasswordCheck = () => {
    const newErrors = { ...errors }
    let isValid = true

    if (modifiedProfile.passwordCheck !== modifiedProfile.password) {
      newErrors.passwordCheck = "비밀번호가 일치하지 않습니다."
      isValid = false
    } else {
      newErrors.passwordCheck = ""
    }

    setErrors((prev) => ({ ...prev, passwordCheck: newErrors.passwordCheck }))
    return isValid
  }

  const validateName = () => {
    const newErrors = { ...errors }
    let isValid = true
    if (modifiedProfile.password.length === 0) {
      newErrors.password = ""
    } else if (modifiedProfile.name.length > 40) {
      newErrors.name = "이름은 최대 40자 이하여야 합니다."
      isValid = false
    } else {
      newErrors.name = ""
    }
    setErrors((prev) => ({ ...prev, name: newErrors.name }))
    return isValid
  }

  const validateForm = async () => {
    let isValid = true

    isValid = (await validateLoginId()) && isValid
    isValid = validatePassword() && isValid
    isValid = validatePasswordCheck() && isValid
    isValid = validateName() && isValid

    return isValid
  }

  const makeRequestData = () => {
    const requestData: {
      loginId: string | null
      password: string | null
      passwordCheck: string | null
      name: string | null
      gender: string | null
      birth: string | null
      email: string | null
    } = {
      loginId: null,
      password: null,
      passwordCheck: null,
      name: null,
      gender: null,
      birth: null,
      email: null,
    }
    const birthDate = `${selectedYear}-${selectedMonth}-${selectedDay}`

    if (modifiedProfile.loginId !== "" && profile.loginId !== modifiedProfile.loginId) {
      requestData.loginId = modifiedProfile.loginId
    }
    if (modifiedProfile.password !== "" && profile.password !== modifiedProfile.password) {
      requestData.password = modifiedProfile.password
      requestData.passwordCheck = modifiedProfile.passwordCheck
    }
    if (modifiedProfile.name !== "" && profile.name !== modifiedProfile.name) {
      requestData.name = modifiedProfile.name
    }
    if (profile.gender !== modifiedProfile.gender) {
      requestData.gender = modifiedProfile.gender
    }
    if (profile.birthDate !== birthDate) {
      requestData.birth = birthDate
    }

    return requestData
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      alert("입력하신 정보를 확인해주세요")
      return
    }

    if (userId !== 0) {
      const requestData = makeRequestData()
      proxy
        .put(`/users/${userId}`, requestData)
        .then(() => {
          alert("수정이 완료되었습니다")
          onClickClose()
          needUpdate()
          proxy.get(`/users/${userId}`).then((res) => {
            setUserName(res.data.response.name)
          })
        })
        .catch((res) => {
          alert(res.response.data.errorMessage)
        })
    }
  }

  useEffect(() => {
    if (userId !== 0) {
      proxy.get(`/users/${userId}`).then((res) => {
        setProfile({
          loginId: res.data.response.loginId,
          password: "",
          passwordCheck: "",
          name: res.data.response.name,
          gender: res.data.response.gender,
          birthDate: res.data.response.birth,
        })
        setModifiedProfile({
          loginId: res.data.response.loginId,
          password: "",
          passwordCheck: "",
          name: res.data.response.name,
          gender: res.data.response.gender,
          birthDate: res.data.response.birth,
        })
        const { birth } = res.data.response
        setSelectedYear(parseInt(birth.split("-")[0], 10))
        setSelectedMonth(parseInt(birth.split("-")[1], 10))
        setSelectedDay(parseInt(birth.split("-")[2], 10))
      })
    }
  }, [userId])
  return (
    <Modal onClickClose={onClickClose} description="변경하고 싶은 정보를 입력 후 버튼을 눌러주세요">
      <div className="p-5 h-0 grow">
        <form
          className="overflow-y-scroll custom-scroll-bar-10px max-h-full -mr-[10px] max-md:custom-scroll-bar-4px max-md:-mr-[4px]"
          onSubmit={(e) => {
            handleSubmit(e)
          }}
        >
          <div className="flex flex-col items-center">
            <TextField
              label="아이디"
              type="text"
              name="loginId"
              placeholder="아이디를 입력하세요"
              value={modifiedProfile.loginId}
              onChange={(e) => {
                limitInputNumber(e, 40)
                handleChange(e)
              }}
              onBlur={() => validateLoginId()}
              error={errors.loginId}
            />

            <TextField
              label="비밀번호"
              type="password"
              name="password"
              value={modifiedProfile.password}
              placeholder="비밀번호를 입력하세요"
              onChange={(e) => {
                limitInputNumber(e, 64)
                handleChange(e)
              }}
              onBlur={() => validatePassword()}
              error={errors.password}
            />

            <TextField
              label="비밀번호 확인"
              type="password"
              name="passwordCheck"
              value={modifiedProfile.passwordCheck}
              placeholder="비밀번호를 입력하세요"
              onChange={(e) => {
                limitInputNumber(e, 64)
                handleChange(e)
              }}
              onBlur={() => validatePasswordCheck()}
              error={errors.passwordCheck}
            />

            <TextField
              label="이름"
              type="text"
              name="name"
              value={modifiedProfile.name}
              placeholder="이름을 입력하세요"
              onChange={(e) => {
                limitInputNumber(e, 40)
                handleChange(e)
              }}
              onBlur={() => validateName()}
              error={errors.name}
            />

            <label htmlFor="gender" className="block w-80 mb-3 max-md:w-64">
              <span className="block text-sm font-medium text-slate-700 max-md:text-xs">성별</span>
              <select
                name="gender"
                value={modifiedProfile.gender}
                onChange={(e) => handleSelectChange(e)}
                className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-main-theme focus:ring-main-theme block w-full rounded-md sm:text-sm focus:ring-1 max-md:text-sm max-md:px-2 max-md:py-1.5"
              >
                <option value="false">남성</option>
                <option value="true">여성</option>
              </select>
            </label>

            <label htmlFor="birthDate" className="block w-80 mb-3 max-md:w-64">
              <span className="block text-sm font-medium text-slate-700 max-md:text-xs">생년월일</span>
              <div className="flex space-x-2 mt-1">
                <select
                  name="birthYear"
                  className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-main-theme focus:ring-main-theme block w-51 rounded-md sm:text-sm focus:ring-1 max-md:text-sm max-md:h-9 max-md:px-2 max-md:py-1.5"
                  placeholder="년도"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                >
                  {generateYearOptions()}
                </select>
                <p className=" py-2 max-md:text-sm ">년</p>
                <select
                  name="birthMonth"
                  className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-main-theme focus:ring-main-theme block w-1/3 rounded-md sm:text-sm focus:ring-1 max-md:text-sm max-md:h-9 max-md:px-2 max-md:py-1.5"
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
                <p className=" py-2 max-md:text-sm ">월</p>
                <select
                  name="birthDay"
                  className="px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-main-theme focus:ring-main-theme block w-1/3 rounded-md sm:text-sm focus:ring-1 max-md:text-sm max-md:h-9 max-md:px-2 max-md:py-1.5"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(parseInt(e.target.value, 10))}
                >
                  {generateDayOptions(selectedYear, selectedMonth)}
                </select>
                <p className=" py-2 max-md:text-sm ">일</p>
              </div>
            </label>

            <button
              className="bg-orange-400 hover:bg-main-theme text-white font-semibold py-2 px-4 rounded w-80 h-12 max-md:w-64 max-md:h-10 max-md:font-normal"
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
