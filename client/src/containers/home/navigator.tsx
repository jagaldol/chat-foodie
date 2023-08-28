"use client"

import React, { useState } from "react"

import NavigatorBox from "@/containers/home/navigatorBox"
import NavigatorToolBox from "@/containers/home/navigatorToollBox"
import CreateChatRoomButton from "@/containers/home/createChatRoomButton"
import DeleteAllChatroomButton from "@/containers/home/deleteAllChatroomButton"
import Drawer from "@/containers/home/drawer"

export default function Navigator() {
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(true)

  const toggleNavigator = () => {
    setIsNavigatorOpen((prev) => !prev)
  }

  return isNavigatorOpen ? (
    <nav className="flex flex-col w-[288px] p-2.5 border-r-gray-200 border-r border-solid ">
      <div className="h-full flex flex-col">
        <div className="mb-8 h-11 flex flex-row items-center justify-center gap-2">
          <CreateChatRoomButton />
          <Drawer onClick={toggleNavigator} />
        </div>
        <div className="grow flex">
          <NavigatorBox />
        </div>
        <div className="border-t-2 border-solid border-gray-400">
          <DeleteAllChatroomButton />
          <NavigatorToolBox />
        </div>
      </div>
    </nav>
  ) : (
    <nav className="left-2 top-[38px] absolute">
      <Drawer onClick={toggleNavigator} />
    </nav>
  )
}
