"use client"

import Image from "next/image"
import React, { useContext, useEffect, useRef, useState } from "react"
import { pressEnter } from "@/utils/utils"
import { ChatRoom } from "@/types/chatroom"
import { ChatroomContext } from "@/contexts/chatroomContextProvider"
import { AuthContext } from "@/contexts/authContextProvider"

export default function ChatroomBox({
  chatRoom,
  onEdit,
  onDelete,
  onClickInnerButton,
}: {
  chatRoom: ChatRoom
  onEdit(id: number, newTitle: string): void
  onDelete(id: number): void
  onClickInnerButton(): void
}) {
  const [editing, setEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(chatRoom.title)
  const { setChatroomId } = useContext(ChatroomContext)
  const { userId, isLoad } = useContext(AuthContext)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const handleEditChatRoomTitle = () => {
    if (editedTitle.trim() !== "") {
      // 수정 로직 처리
      setEditedTitle(editedTitle.trim())
      onEdit(chatRoom.id, editedTitle)
    }
    setEditing(false)
  }

  const handleChatRoomClick = () => {
    if (!editing) {
      setChatroomId(chatRoom.id) // 클릭된 채팅방의 ID를 ChatroomContext에 전달
    }
  }

  const handleContainerClick = (event: MouseEvent) => {
    // 컨테이너 외부를 클릭하면 수정 상태 종료
    if (!containerRef.current?.contains(event.target as HTMLElement)) {
      setEditing(false)
    }
  }
  useEffect(() => {
    // 컨테이너 외부 클릭 시 이벤트 리스너 등록
    document.addEventListener("mousedown", handleContainerClick)
    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 해제
      document.removeEventListener("mousedown", handleContainerClick)
    }
  }, [])
  if (!isLoad) return null
  if (userId !== 0)
    return (
      <div
        className="flex items-center hover:bg-gray-100 border-t-gray-300 border-t text-sm max-md:text-xs font-bold text-left"
        ref={containerRef}
      >
        <Image src="/svg/message.svg" alt="message" height="12" width="12" className="ml-3.5 mr-3.5" />
        {editing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={(e) => {
              pressEnter(e, () => handleEditChatRoomTitle())
            }}
            onBlur={handleEditChatRoomTitle}
            className="pl-[7px] my-[3px] py-2 rounded-md border border-gray-300 text-left outline-none focus-within:border-main-theme"
            style={{
              maxWidth: "150px",
              overflow: "hidden", // 일정 길이 이상일 때 숨김
              whiteSpace: "nowrap", // 줄 바꿈 방지
            }}
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              handleChatRoomClick()
              onClickInnerButton()
            }}
            className="text-left flex-grow pl-2 bg-transparent border-none cursor-pointer py-3"
            style={{
              maxWidth: "150px",
              overflow: "hidden", // 일정 길이 이상일 때 숨김
              whiteSpace: "nowrap", // 줄 바꿈 방지
            }}
          >
            {chatRoom.title}
          </button>
        )}
        <div className="ml-3 flex items-center">
          <Image
            src="/svg/pen.svg"
            alt="chat"
            height="12"
            width="12"
            className="ml-2 cursor-pointer"
            onClick={() => setEditing(true)}
          />
          <Image
            src="/svg/delete.svg"
            alt="chat"
            height="11"
            width="12"
            style={{ height: "11px" }}
            className="ml-3  cursor-pointer"
            onClick={() => onDelete(chatRoom.id)}
          />
        </div>
      </div>
    )
}
