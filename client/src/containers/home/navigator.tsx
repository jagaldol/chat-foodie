"use client"

import Image from "next/image"
import React, { useContext, useEffect, useState } from "react"
import ChatroomBox from "@/containers/home/chatroomBox"
import { getJwtTokenFromStorage } from "@/utils/jwtDecoder"
import proxy from "@/utils/proxy"
import { ChatRoom } from "@/types/chatroom"
import { AuthContext } from "@/contexts/authContextProvider"

function NavFooterTool({ iconSrc, text, link }: { iconSrc: string; text: string; link: string }) {
  return (
    <a className="flex mt-7 ml-2.5 items-center" href={link}>
      <Image src={iconSrc} alt="" height="16" width="16" style={{ height: "16px" }} />
      <p className="ml-2 text-sm">{text}</p>
    </a>
  )
}

export default function Navigator() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const { userId, isLoad } = useContext(AuthContext)

  const headers = {
    Authorization: getJwtTokenFromStorage(),
  }

  const fetchChatRooms = async () => {
    try {
      const response = await proxy.get("/chatrooms", { headers })
      setChatRooms(response.data.response.chatrooms)
    } catch (error) {
      console.error("Error fetching chat rooms:", error)
      alert("채팅방 목록을 가져오는 도중 오류가 발생하였습니다.")
    }
  }

  useEffect(() => {
    fetchChatRooms()
  }, [])

  const createNewChatroom = async () => {
    try {
      const response = await proxy.post("/chatrooms", {}, { headers })

      if (response.data.status === 200) {
        // Successfully created a new chatroom
        fetchChatRooms() // Refresh the chatroom list
      } else {
        alert("채팅방 생성에 실패하였습니다.")
      }
    } catch (error) {
      alert("오류가 발생하였습니다.")
    }
  }

  const handleEditChatRoomTitle = async (id: number, newTitle: string) => {
    try {
      const requestData = {
        title: newTitle,
      }

      const response = await proxy.put(`/chatrooms/${id}`, requestData, { headers })
      if (response.data.status === 200) {
        fetchChatRooms()
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
      const response = await proxy.delete(`/chatrooms/${id}`, { headers })
      if (response.data.status === 200) {
        fetchChatRooms()
      } else {
        alert("삭제에 실패하였습니다.")
      }
    } catch (error) {
      console.error("Error deleting chat room:", error)
      alert("채팅방 삭제 도중 오류가 발생하였습니다.")
    }
  }
  if (!isLoad) return null
  if (userId !== 0)
    return (
      <nav className="flex flex-col min-w-[16rem] p-2.5 border-r-gray-200 border-r border-solid">
        <button
          type="button"
          className="border-solid border border-gray-300 rounded-md h-11 flex items-center hover:bg-gray-100 hover:border-gray-200 transition"
          onClick={createNewChatroom}
        >
          <Image src="/svg/add.svg" alt="add" height="20" width="20" className="ml-4" />
          <p className="ml-2 text-sm font-bold">새로운 대화</p>
        </button>
        {chatRooms.map((chatRoom) => (
          <ChatroomBox
            key={chatRoom.id}
            chatRoom={chatRoom}
            onEdit={handleEditChatRoomTitle}
            onDelete={handleDeleteChatRoom}
          />
        ))}
        <hr className="mt-2 border-gray-300" />
        <div className="grow" />
        <div className="border-t-2 border-solid border-gray-400">
          <div>
            <NavFooterTool
              iconSrc="/svg/github.svg"
              text="View in github"
              link="https://github.com/jagaldol/chat-foodie"
            />
            <NavFooterTool
              iconSrc="/svg/envelope-solid.svg"
              text="chatfoodie2023@gmail.com"
              link="mailto:chatfoodie2023@gmail.com"
            />
          </div>
        </div>
      </nav>
    )
  return (
    <nav className="flex flex-col min-w-[16rem] p-2.5 border-r-gray-200 border-r border-solid">
      <hr className="mt-2 border-gray-300" />
      <div className="grow" />
      <div className="border-t-2 border-solid border-gray-400">
        <div>
          <NavFooterTool
            iconSrc="/svg/github.svg"
            text="View in github"
            link="https://github.com/jagaldol/chat-foodie"
          />
          <NavFooterTool
            iconSrc="/svg/envelope-solid.svg"
            text="chatfoodie2023@gmail.com"
            link="mailto:chatfoodie2023@gmail.com"
          />
        </div>
      </div>
    </nav>
  )
}
