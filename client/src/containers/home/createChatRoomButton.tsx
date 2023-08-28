"use client"

import Image from "next/image"
import React, { useContext } from "react"
import { getJwtTokenFromStorage } from "@/utils/jwtDecoder"
import proxy from "@/utils/proxy"
import { ChatroomContext } from "@/contexts/chatroomContextProvider"
import { AuthContext } from "@/contexts/authContextProvider"

export default function CreateChatRoomButton() {
  const { userId } = useContext(AuthContext)
  const { setChatroomId } = useContext(ChatroomContext)
  const createNewChatroom = async () => {
    try {
      const headers = {
        Authorization: getJwtTokenFromStorage(),
      }
      const response = await proxy.post("/chatrooms", {}, { headers })
      // 새로운 채팅방으로 이동
      setChatroomId(response.data.response.chatroomId)
    } catch (error) {
      alert("오류가 발생하였습니다.")
    }
  }
  return (
    <button
      type="button"
      className="h-full border-solid border grow border-gray-300 rounded hover:bg-gray-100 transition flex items-center"
      onClick={() => {
        if (userId !== 0) createNewChatroom().then()
        else window.location.href = "/"
      }}
    >
      <Image src="/svg/add.svg" alt="add" height="20" width="20" className="ml-4" />
      <p className="ml-2 text-sm font-bold">새로운 대화</p>
    </button>
  )
}
