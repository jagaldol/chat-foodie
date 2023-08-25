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
    setIsNavigatorOpen(!isNavigatorOpen)
  }

  return isNavigatorOpen ? (
    <nav className="flex flex-col min-w-[18rem] p-2.5 border-r-gray-200 border-r border-solid">
      <div className="h-full flex flex-col">
        <div className="flex flex-row">
          <div className="mb-8 border-solid border border-gray-300 rounded-md w-[80%] h-11 flex items-center hover:bg-gray-100 hover:border-gray-200 transition">
            <CreateChatRoomButton />
          </div>
          <div className="ml-4 mb-8 border-solid border border-gray-300 rounded-md h-11 flex items-center hover:bg-gray-100 hover:border-gray-200 transition">
            <Drawer isOpen={isNavigatorOpen} onClose={toggleNavigator} />
          </div>
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
    <nav className="left-2 top-[30px] absolute">
      <div className="mb-8 border-solid border border-gray-300 rounded-md h-11 flex items-center hover:bg-gray-100 hover:border-gray-200 transition">
        <Drawer isOpen={isNavigatorOpen} onClose={toggleNavigator} />
      </div>
    </nav>
  )
}
