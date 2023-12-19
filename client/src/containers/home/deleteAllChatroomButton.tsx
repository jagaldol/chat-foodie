"use client"

import React, { useContext } from "react"
import proxy from "@/utils/proxy"
import { ChatroomContext } from "@/contexts/chatroomContextProvider"
import { ChatRoom } from "@/types/chatroom"
import { AuthContext } from "@/contexts/authContextProvider"
import NavFooterTool from "@/components/navfooterTool"

export default function DeleteAllChatroomButton() {
  const { userId, isLoad } = useContext(AuthContext)
  const { setChatroomId, needUpdate } = useContext(ChatroomContext)

  const handleDeleteAllChatRooms = async () => {
    setChatroomId(0)
    try {
      // Use array iteration to delete each chat room
      const response = await proxy.get("/chatrooms")
      if (response.data.response.chatrooms === null) return
      const { chatrooms } = response.data.response

      await Promise.all(
        chatrooms.map(async (chatRoom: ChatRoom) => {
          await proxy.delete(`/chatrooms/${chatRoom.id}`)
        }),
      )
      // Update the chat room list
    } catch (error) {
      alert("대화방 삭제 도중 오류가 발생하였습니다.")
    }
    needUpdate()
  }

  return isLoad && userId !== 0 ? (
    <NavFooterTool
      iconSrc="/svg/delete-all.svg"
      text="대화 전체 삭제"
      func={() => {
        handleDeleteAllChatRooms().then()
      }}
    />
  ) : null
}
