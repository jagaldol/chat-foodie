"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import proxy from "@/utils/proxy"
import { ChatRoom } from "@/types/chatroom"
import { getJwtTokenFromStorage } from "@/utils/jwtDecoder"
import { pressEnter } from "@/utils/utils"

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
  const [editingChatRoom, setEditingChatRoom] = useState<boolean>(false)
  const [editedTitle, setEditedTitle] = useState<string | null>(null)

  const headers = {
    Authorization: getJwtTokenFromStorage(),
  }

  const fetchChatRooms = () => {
    proxy
      .get("/chatrooms", { headers })
      .then((res) => {
        setChatRooms(res.data.response.chatrooms)
      })
      .catch((res) => {
        alert(res.response.data.errorMessage)
      })
  }

  useEffect(() => {
    fetchChatRooms()
  }, [])

  const handleEditChatRoomTitle = async (chatRoom: ChatRoom) => {
    try {
      const requestData = {
        title: editedTitle,
      }

      const response = await proxy.put(`/chatrooms/${chatRoom.id}`, requestData, { headers })
      if (response.data.status === 200) {
        setChatRooms((prevChatRooms) =>
          prevChatRooms.map((room) => (room.id === chatRoom.id ? { ...room, title: chatRoom.title } : room)),
        )
        fetchChatRooms()
        setEditingChatRoom(false)
        setEditedTitle(null)
      } else {
        alert("채팅방 제목 수정에 실패하였습니다.")
      }
    } catch (error) {
      alert("오류")
    }
  }

  const handleDeleteChatRoom = async (chatroomId: number) => {
    try {
      const response = await proxy.delete(`/chatrooms/${chatroomId}`, { headers })
      if (response.data.status === 200) {
        // 성공적으로 삭제되었으면 해당 채팅방을 chatRooms 배열에서 제거
        setChatRooms((prevChatRooms) => prevChatRooms.filter((room) => room.id !== chatroomId))
      } else {
        alert("삭제에 실패하였습니다.")
      }
    } catch (error) {
      alert("오류가 발생하였습니다.")
    }
  }

  return (
    <nav className="flex flex-col min-w-[16rem] p-2.5 border-r-gray-200 border-r border-solid">
      <a
        type="button"
        className="border-solid border border-gray-300 rounded-md h-11 flex items-center hover:bg-gray-100 hover:border-gray-200 transition"
        href="/"
      >
        <Image src="/svg/add.svg" alt="add" height="20" width="20" className="ml-4" />
        <p className="ml-2 text-sm font-bold">새로운 대화</p>
      </a>
      <hr className="mt-2 border-gray-300" />
      {chatRooms.map((chatRoom, index) => (
        <div key={chatRoom.id} className="flex items-center mt-3 mb-3">
          <Image src="/svg/message.svg" alt="message" height="12" width="12" />
          {editingChatRoom ? (
            <input
              type="text"
              value={editedTitle !== null ? editedTitle : chatRoom.title}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={(e) => {
                if (editedTitle === "" || editedTitle === chatRoom.title) {
                  pressEnter(e, () => setEditingChatRoom(false))
                } else {
                  pressEnter(e, () => handleEditChatRoomTitle(chatRoom))
                }
              }}
              onBlur={() => {
                if (editedTitle === "" || editedTitle === chatRoom.title) {
                  setEditingChatRoom(false)
                } else {
                  handleEditChatRoomTitle(chatRoom)
                }
              }}
              className="w-1/2 p-1 rounded-md border border-gray-300 focus:ring focus:ring-blue-200"
            />
          ) : (
            <p className="ml-2 text-sm font-bold">{chatRoom.title}</p>
          )}
          <div className="ml-auto flex items-center">
            <Image
              src="/svg/pen.svg"
              alt="chat"
              height="12"
              width="12"
              className="ml-3 cursor-pointer"
              onClick={() => setEditingChatRoom(true)}
            />
            <Image
              src="/svg/delete.svg"
              alt="chat"
              height="11"
              width="12"
              className="ml-3 mr-4 cursor-pointer"
              onClick={() => handleDeleteChatRoom(chatRoom.id)}
            />
          </div>
          {index !== chatRooms.length - 1 && <hr className="mt-2 border-gray-300" />}
        </div>
      ))}
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
