"use client"

import { useContext, useState, useEffect } from "react"
import Modal from "@/components/modal"
import TextField from "@/components/textField"
import { AuthContext } from "@/contexts/authContextProvider"
import { deleteJwt, getJwtTokenFromStorage, saveJwt } from "@/utils/jwtDecoder"
import { limitInputNumber } from "@/utils/utils"
import proxy from "@/utils/proxy"

export default function EmailVerificationModal({ onClickClose }: { onClickClose(): void }) {
  const { userId, needUpdate } = useContext(AuthContext)
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

    const headers = {
      Authorization: getJwtTokenFromStorage(),
    }
    const requestData = {
      verificationCode: e.currentTarget.querySelector<HTMLInputElement>(`[name='emailVerificationCode']`)!.value,
    }
    proxy
      .post("/email-verifications/confirm", requestData, { headers })
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
    const headers = {
      Authorization: getJwtTokenFromStorage(),
    }
    setDisableButton(true)
    setMessage("인증 코드 전송 중")
    proxy
      .post("/email-verifications", undefined, { headers })
      .then(() => {
        setDisableButton(false)
        setMessage("인증 코드 전송 완료")
      })
      .catch((res) => {
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
        await proxy.post("/validate/email", requestData)
        setEmailError("")
      } catch (e: any) {
        if (e.response.data.status === 462) {
          isValid = false
          setEmailError("이미 존재하는 이메일 입니다.")
          if (modifiedEmail === email) {
            setEmailError("")
            isValid = true
          }
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
    } else {
      setCodeError("")
    }

    return isValid
  }

  const modifyEmail = () => {
    if (modifiedEmail === email) {
      return
    }

    if (!validateEmail()) {
      alert("이메일 주소를 확인해 주세요")
    }

    const headers = {
      Authorization: getJwtTokenFromStorage(),
    }
    const requestData = {
      email: modifiedEmail,
    }
    setEmail(modifiedEmail)
    proxy.put(`/users/${userId}`, requestData, { headers }).then(() => {
      setEmail(modifiedEmail)
      setModifyMessage("이메일 변경 완료")
      sendVerificationCode()
    })
  }

  useEffect(() => {
    const headers = {
      Authorization: getJwtTokenFromStorage(),
    }
    proxy.get(`/users/${userId}`, { headers }).then((res) => {
      setEmail(res.data.response.email)
      setModifiedEmail(res.data.response.email)
    })
  }, [])

  return (
    <Modal
      onClickClose={() => {
        alert("로그아웃 됩니다.")
        deleteJwt()
        needUpdate()
      }}
    >
      <div className="p-5 h-0 grow">
        <form className="overflow-y-scroll custom-scroll-bar-10px max-h-full" onSubmit={handleSubmit}>
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
              className="bg-orange-400 hover:bg-main-theme text-white font-semibold py-2 px-4 rounded w-80 h-12 mb-3"
            >
              이메일 주소 변경
            </button>
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
              className="bg-orange-400 hover:bg-main-theme text-white font-semibold py-2 px-4 rounded w-80 h-12 mb-3 disabled:opacity-50"
              type="button"
              disabled={disableButton}
              onClick={sendVerificationCode}
            >
              인증 코드 재전송
            </button>

            <button
              className="bg-orange-400 hover:bg-main-theme text-white font-semibold py-2 px-4 rounded w-80 h-12 mb-3"
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
