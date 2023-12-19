"use client"

import { useContext, useState, useEffect } from "react"
import Modal from "@/components/modal"
import TextField from "@/components/textField"
import { AuthContext } from "@/contexts/authContextProvider"
import { deleteJwt, saveJwt } from "@/utils/jwtDecoder"
import { limitInputNumber } from "@/utils/utils"
import proxy from "@/utils/proxy"

export default function EmailVerificationModal({ onClickClose }: { onClickClose(): void }) {
  const { userId, userRole, needUpdate } = useContext(AuthContext)
  const [disableButton, setDisableButton] = useState(false)
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [modifiedEmail, setModifiedEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [modifyMessage, setModifyMessage] = useState("")
  const [codeError, setCodeError] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const requestData = {
      verificationCode: e.currentTarget.querySelector<HTMLInputElement>(`[name='emailVerificationCode']`)!.value,
    }
    proxy
      .post("/email-verifications/confirm", requestData)
      .then((res) => {
        const jwt = res.headers.authorization
        saveJwt(jwt)
        needUpdate()
        onClickClose()
        alert("인증이 완료되었습니다.")
      })
      .catch((res) => {
        if (res.response.data.status === 400) {
          setCodeError("인증코드가 일치하지 않습니다.")
        }
      })
  }

  const sendVerificationCode = () => {
    setDisableButton(true)
    setMessage("인증 코드 전송 중")
    proxy
      .post("/email-verifications")
      .then(() => {
        setDisableButton(false)
        setMessage("인증 코드 전송 완료")
      })
      .catch((res) => {
        setMessage("")
        alert(res.response.data.errorMessage)
      })
  }

  const validateEmail = async () => {
    let isValid = true

    if (modifiedEmail.trim() === "") {
      setEmailError("이메일을 입력해주세요.")
      isValid = false
    } else if (!/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(modifiedEmail)) {
      setEmailError("올바른 이메일 주소를 입력해주세요.")
      isValid = false
    } else if (modifiedEmail.length > 100) {
      setEmailError("이메일은 최대 100자 이하여야 합니다.")
      isValid = false
    } else {
      const requestData = {
        email: modifiedEmail,
      }
      try {
        if (modifiedEmail !== email) {
          await proxy.post("/validate/email", requestData)
          setEmailError("")
        }
      } catch (e: any) {
        if (e.response.data.status === 462) {
          isValid = false
          setEmailError("이미 존재하는 이메일 입니다.")
        }
      }
    }

    return isValid
  }

  const validateCode = () => {
    let isValid = true

    if (verificationCode.length !== 6) {
      isValid = false
      setCodeError("인증 코드는 6자리여야 합니다.")
    } else if (!/^\d{6}$/.test(verificationCode)) {
      isValid = false
      setCodeError("숫자만 입력하세요.")
    } else {
      setCodeError("")
    }

    return isValid
  }

  const modifyEmail = async () => {
    if (modifiedEmail === email) {
      setEmailError("동일한 이메일로 변경할 수 없습니다")
      return
    }

    if (!(await validateEmail())) {
      alert("이메일 주소를 확인해 주세요")
      return
    }

    if (userRole !== "ROLE_PENDING") {
      if (!confirm("이메일 변경하면 인증하기 전까지 로그인할 수 없습니다.\n 변경하시겠습니까?")) return
    }
    const requestData = {
      email: modifiedEmail,
    }
    proxy.put(`/users/${userId}`, requestData).then((res) => {
      setEmail(modifiedEmail)
      setModifyMessage("이메일 변경 완료")
      sendVerificationCode()
      const jwt = res.headers.authorization
      saveJwt(jwt)
      needUpdate()
    })
  }

  useEffect(() => {
    proxy.get(`/users/${userId}`).then((res) => {
      setEmail(res.data.response.email)
      setModifiedEmail(res.data.response.email)
    })
  }, [userId])

  return (
    <Modal
      onClickClose={() => {
        if (userRole === "ROLE_PENDING") {
          alert("로그아웃 됩니다.")
          deleteJwt()
          needUpdate()
        }
        onClickClose()
      }}
    >
      <div className="p-5 h-0 grow">
        <form className="overflow-y-scroll custom-scroll-bar-10px max-h-full -mr-[10px]" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center">
            <TextField
              label="이메일 확인"
              type="text"
              name="email"
              placeholder="변경할 이메일 주소를 입력해주세요."
              value={modifiedEmail}
              onChange={(e) => {
                limitInputNumber(e, 100)
                setModifiedEmail(e.target.value)
                setModifyMessage("")
              }}
              onBlur={() => validateEmail()}
              error={emailError}
              message={modifyMessage}
            />
            <button
              type="button"
              onClick={() => modifyEmail()}
              className="bg-orange-400 hover:bg-main-theme text-white font-semibold p-2 rounded w-80 h-12 mb-3 max-md:w-64 max-md:h-10 max-md:font-normal"
            >
              이메일 주소 변경
            </button>

            <div className="flex flex-row w-80 space-x-2 max-md:w-64">
              <TextField
                label="이메일 인증 코드"
                type="text"
                name="emailVerificationCode"
                placeholder="인증 코드를 입력하세요(6자리)"
                onChange={(e) => {
                  limitInputNumber(e, 6)
                  setVerificationCode(e.target.value)
                }}
                onBlur={() => validateCode()}
                required
                value={verificationCode}
                error={codeError}
                message={message}
              />
              <button
                className="bg-orange-400 hover:bg-main-theme text-white font-semibold p-2 rounded w-1/3 h-10 mt-6 disabled:opacity-50 max-md:mt-5 max-md:font-normal max-md:h-9 max-md:text-sm"
                type="button"
                disabled={disableButton}
                onClick={sendVerificationCode}
              >
                재전송
              </button>
            </div>
            <button
              className="bg-orange-400 hover:bg-main-theme text-white font-semibold p-2 rounded w-80 h-12 mb-3 max-md:w-64 max-md:h-10 max-md:font-normal"
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
