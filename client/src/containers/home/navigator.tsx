"use client"

import React, { useState } from "react"

import { useMediaQuery } from "react-responsive"
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

  const isMobile = useMediaQuery({ maxWidth: 768 })

  return isNavigatorOpen ? (
    <nav
      className={`flex flex-col  p-2.5 border-r-gray-200 border-r border-solid ${
        isMobile
          ? `fixed top-0 left-0 w-1/2 h-full bg-gray-200 transform transition-transform ease-in-out duration-300 ${
              isNavigatorOpen ? "translate-x-0" : "-translate-x-full"
            }`
          : "min-w-[288px]"
      }`}
    >
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
