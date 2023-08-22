"use client"

import Image from "next/image"
import React, { useContext, useEffect, useState } from "react"
import { AuthContext } from "@/contexts/authContextProvider"
import { ChatroomContext } from "@/contexts/chatroomContextProvider"
import { getJwtTokenFromStorage } from "@/utils/jwtDecoder"
import proxy from "@/utils/proxy"
import ChatroomBox from "@/containers/home/chatroomBox"
import { ChatRoom } from "@/types/chatroom"

export default function NavigatorBox() {
  const { userId, isLoad } = useContext(AuthContext)
  const { chatroomId, setChatroomId } = useContext(ChatroomContext)
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])

  const fetchChatRooms = async () => {
    try {
      const headers = {
        Authorization: getJwtTokenFromStorage(),
      }
      console.log(headers)
      const response = await proxy.get("/chatrooms", { headers })
      if (response.data.response.chatrooms === null) return
      setChatRooms(response.data.response.chatrooms)
    } catch (error) {
      console.error("Error fetching chat rooms:", error)
    }
  }

  useEffect(() => {
    if (userId !== 0) fetchChatRooms()
    console.log(chatroomId)
    console.log(userId)
  }, [chatroomId, userId])

  useEffect(() => {
    if (userId === 0) setChatRooms([])
  }, [userId])

  const handleEditChatRoomTitle = async (id: number, newTitle: string) => {
    try {
      const requestData = {
        title: newTitle,
      }
      const headers = {
        Authorization: getJwtTokenFromStorage(),
      }
      fetchChatRooms()
      const response = await proxy.put(`/chatrooms/${id}`, requestData, { headers })
      if (response.data.status === 200) {
        console.log("채팅방 수정")
      } else {
        alert("채팅방 제목 수정에 실패하였습니다.")
      }
    } catch (error) {
      console.error("Error editing chat room title:", error)
      alert("채팅방 제목 수정 도중 오류가 발생하였습니다.")
    }
  }

  const handleDeleteChatRoom = async (id: number) => {
    try {
      const headers = {
        Authorization: getJwtTokenFromStorage(),
      }
      const response = await proxy.delete(`/chatrooms/${id}`, { headers })
      if (response.data.status === 200) {
        console.log("삭제 성공")
        if (id === chatroomId) setChatroomId(0)
      } else {
        alert("삭제에 실패하였습니다.")
      }
    } catch (error) {
      console.error("Error deleting chat room:", error)
      alert("채팅방 삭제 도중 오류가 발생하였습니다.")
    }
    fetchChatRooms()
  }

  const handleDeleteAllChatRooms = async () => {
    try {
      const headers = {
        Authorization: getJwtTokenFromStorage(),
      }
      // Use array iteration to delete each chat room
      await Promise.all(
        chatRooms.map(async (chatRoom) => {
          await proxy.delete(`/chatrooms/${chatRoom.id}`, { headers })
        }),
      )
      // Update the chat room list
    } catch (error) {
      console.error("Error deleting chat rooms:", error)
      alert("대화방 삭제 도중 오류가 발생하였습니다.")
    }
    fetchChatRooms()
    setChatroomId(0)
  }

  if (!isLoad) return null
  if (userId !== 0)
    return (
      <div>
        <hr className="mt-8" />
        <div className="h-0 flex-grow">
          <div className="mb-2 max-h-full overflow-y-scroll custom-scroll-bar-6px">
            {chatRooms.map((chatRoom) => (
              <React.Fragment key={chatRoom.id}>
                <hr className="border-gray-300" />
                <ChatroomBox
                  key={chatRoom.id}
                  chatRoom={chatRoom}
                  onEdit={handleEditChatRoomTitle}
                  onDelete={handleDeleteChatRoom}
                />
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="fixed bottom-0 left-0 w-full border-t-2 border-solid border-gray-400 bg-white" />
        <div className="border-t-2 border-solid border-gray-400">
          <div>
            <button type="button" className="flex mt-7 ml-2.5 items-center" onClick={handleDeleteAllChatRooms}>
              <Image src="/svg/delete-all.svg" alt="delete-all" height="16" width="16" />
              <p className="ml-2 text-sm">대화 전체 삭제</p>
            </button>
          </div>
        </div>
      </div>
    )
  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow" />
      <hr className="mt-2 border-gray-300" />
      <div className="border-t-2 border-solid border-gray-400" />
    </div>
  )
}
