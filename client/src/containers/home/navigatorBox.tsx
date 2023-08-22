"use client"

import Image from "next/image"
import React, { useContext, useEffect, useState } from "react"
import { AuthContext } from "@/contexts/authContextProvider"
import { ChatroomContext } from "@/contexts/chatroomContextProvider"
import { getJwtTokenFromStorage } from "@/utils/jwtDecoder"
import proxy from "@/utils/proxy"
import ChatroomBox from "@/containers/home/chatroomBox"
import { ChatRoom } from "@/types/chatroom"

function NavFooterTool({ iconSrc, text, link }: { iconSrc: string; text: string; link: string }) {
  return (
    <a className="flex mt-7 ml-2.5 items-center" href={link}>
      <Image src={iconSrc} alt="" height="16" width="16" style={{ height: "16px" }} />
      <p className="ml-2 text-sm">{text}</p>
    </a>
  )
}

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
      <div className="h-[840px]">
        <button
          type="button"
          className="w-[266px] border-solid border border-gray-300 rounded-md h-11 flex items-center hover:bg-gray-100 hover:border-gray-200 transition"
          onClick={createNewChatroom}
        >
          <Image src="/svg/add.svg" alt="add" height="20" width="20" className="ml-4" />
          <p className="ml-2 text-sm font-bold">새로운 대화</p>
        </button>
        <hr className="mt-8" />
        <div className="h-[630px] overflow-scroll">
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
        <div className="fixed bottom-0 left-0 w-full border-t-2 border-solid border-gray-400 bg-white" />
        <div className="border-t-2 border-solid border-gray-400">
          <div>
            <button type="button" className="flex mt-7 ml-2.5 items-center" onClick={handleDeleteAllChatRooms}>
              <Image src="/svg/delete-all.svg" alt="delete-all" height="16" width="16" />
              <p className="ml-2 text-sm">대화 전체 삭제</p>
            </button>
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
      </div>
    )
  return (
    <div className="h-[840px]">
      <a
        type="button"
        className="border-solid border border-gray-300 rounded-md h-11 flex items-center hover:bg-gray-100 hover:border-gray-200 transition"
        href="/"
      >
        <Image src="/svg/add.svg" alt="add" height="20" width="20" className="ml-4" />
        <p className="ml-2 text-sm font-bold">새로운 대화</p>
      </a>
      <div className="h-[700px]" />
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
    </div>
  )
}
