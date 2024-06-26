"use client"

import React, { useContext, useEffect, useState } from "react"
import { AuthContext } from "@/contexts/authContextProvider"
import { ChatroomContext } from "@/contexts/chatroomContextProvider"
import proxy from "@/utils/proxy"
import ChatroomBox from "@/containers/home/chatroomBox"
import { ChatRoom } from "@/types/chatroom"

export default function NavigatorBox({ onClickInnerButton }: { onClickInnerButton(): void }) {
  const { userId, isLoad, userRole } = useContext(AuthContext)
  const { chatroomId, setChatroomId, update } = useContext(ChatroomContext)
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])

  const fetchChatRooms = async () => {
    const response = await proxy.get("/chatrooms")
    if (response.data.response.chatrooms === null) return
    setChatRooms(response.data.response.chatrooms)
  }

  const handleEditChatRoomTitle = async (id: number, newTitle: string) => {
    try {
      const requestData = {
        title: newTitle,
      }
      fetchChatRooms().then(() => {})
      await proxy.put(`/chatrooms/${id}`, requestData)
    } catch (error) {
      alert("채팅방 제목 수정 도중 오류가 발생하였습니다.")
    }
    fetchChatRooms().then(() => {})
  }
  const handleDeleteChatRoom = async (id: number) => {
    if (id === chatroomId) setChatroomId(0)
    try {
      await proxy.delete(`/chatrooms/${id}`)
    } catch (error) {
      alert("채팅방 삭제 도중 오류가 발생하였습니다.")
    }
    fetchChatRooms().then(() => {})
  }

  useEffect(() => {
    if (userId !== 0 && userRole !== "ROLE_PENDING") fetchChatRooms().then(() => {})
    else setChatRooms([])
  }, [chatroomId, userId, userRole])

  useEffect(() => {
    if (userId !== 0 && userRole !== "ROLE_PENDING") fetchChatRooms().then(() => {})
  }, [update, userId, userRole])

  return isLoad && userId !== 0 ? (
    <div className="grow flex flex-col">
      <div className="grow h-0">
        <div className="max-h-full overflow-x-hidden overflow-y-scroll custom-scroll-bar-6px -mr-[6px]">
          {chatRooms.map((chatRoom) => (
            <ChatroomBox
              key={chatRoom.id}
              chatRoom={chatRoom}
              onEdit={handleEditChatRoomTitle}
              onDelete={handleDeleteChatRoom}
              onClickInnerButton={onClickInnerButton}
            />
          ))}
        </div>
      </div>
    </div>
  ) : null
}
