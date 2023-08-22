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

      if (response.data.status === 200) {
        const newChatRoomId = response.data.response.chatroomId

        // 채팅방 목록 업데이트
        console.log(newChatRoomId)
        // 새로운 채팅방으로 이동
        setChatroomId(newChatRoomId)
      } else {
        alert("채팅방 생성에 실패하였습니다.")
      }
    } catch (error) {
      alert("오류가 발생하였습니다.")
    }
  }
  return userId !== 0 ? (
    <button
      type="button"
      className="w-[266px] border-solid border border-gray-300 rounded-md h-11 flex items-center hover:bg-gray-100 hover:border-gray-200 transition"
      onClick={createNewChatroom}
    >
      <Image src="/svg/add.svg" alt="add" height="20" width="20" className="ml-4" />
      <p className="ml-2 text-sm font-bold">새로운 대화</p>
    </button>
  ) : (
    <a
      type="button"
      className="border-solid border border-gray-300 rounded-md h-11 flex items-center hover:bg-gray-100 hover:border-gray-200 transition"
      href="/"
    >
      <Image src="/svg/add.svg" alt="add" height="20" width="20" className="ml-4" />
      <p className="ml-2 text-sm font-bold">새로운 대화</p>
    </a>
  )
}
