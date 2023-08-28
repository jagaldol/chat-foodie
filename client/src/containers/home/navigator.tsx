"use client"

import React, { useRef, useState } from "react"

import { useMediaQuery } from "react-responsive"
import NavigatorBox from "@/containers/home/navigatorBox"
import NavigatorToolBox from "@/containers/home/navigatorToollBox"
import CreateChatRoomButton from "@/containers/home/createChatRoomButton"
import DeleteAllChatroomButton from "@/containers/home/deleteAllChatroomButton"
import Drawer from "@/containers/home/drawer"

export default function Navigator() {
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(true)

  const navbarRef = useRef<HTMLDivElement | null>(null)
  const navOpenButton = useRef<HTMLDivElement | null>(null)
  const toggleNavigator = () => {
    setIsNavigatorOpen((prev) => {
      if (prev) {
        setTimeout(() => navOpenButton.current?.classList.remove("hidden"), 300)
      } else {
        navOpenButton.current?.classList.add("hidden")
      }

      return !prev
    })
  }

  const isMobile = useMediaQuery({ maxWidth: 768 })

  return (
    <>
      <nav
        ref={navbarRef}
        className={`absolute h-screen z-10 flex flex-col min-w-[288px] py-9 px-2.5 border-r-gray-200 border-r border-solid transition-all ease-in-out duration-300 bg-white ${
          isNavigatorOpen ? "translate-x-0" : "-translate-x-full -mr-[288px]"
        }
      `}
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
      <div className="left-2 top-[38px] absolute hidden" ref={navOpenButton}>
        <Drawer onClick={toggleNavigator} />
      </div>
    </>
  )
}
