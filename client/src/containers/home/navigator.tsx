"use client"

import React, { useEffect, useRef, useState } from "react"

import { useMediaQuery } from "react-responsive"
import Image from "next/image"
import NavigatorBox from "@/containers/home/navigatorBox"
import NavigatorToolBox from "@/containers/home/navigatorToollBox"
import CreateChatRoomButton from "@/containers/home/createChatRoomButton"
import DeleteAllChatroomButton from "@/containers/home/deleteAllChatroomButton"

export default function Navigator() {
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false)

  const navbarRef = useRef<HTMLDivElement | null>(null)
  const navOpenButton = useRef<HTMLDivElement | null>(null)

  const isTablet = useMediaQuery({ maxWidth: 1024 })

  const onClickInnerButton = () => {
    if (isTablet) setIsNavigatorOpen(false)
  }

  useEffect(() => {
    const outsideListener = ({ target }: MouseEvent) => {
      if (
        !(navbarRef.current?.contains(target as HTMLElement) || navOpenButton.current?.contains(target as HTMLElement))
      ) {
        setIsNavigatorOpen(false)
      }
    }
    if (isTablet) {
      setIsNavigatorOpen(false)
      window.addEventListener("click", outsideListener)
    } else {
      setIsNavigatorOpen(true)
      window.removeEventListener("click", outsideListener)
    }
    return () => window.removeEventListener("click", outsideListener)
  }, [isTablet])

  useEffect(() => {
    const setScreenSize = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty("--vh", `${vh}px`)
    }
    window.addEventListener("resize", setScreenSize)
    setScreenSize()
    return () => window.removeEventListener("resize", setScreenSize)
  }, [])

  return (
    <>
      <nav
        ref={navbarRef}
        className={`fixed left-0 h-full z-20 flex flex-col min-w-[288px] max-md:pb-5 max-md:pt-7 py-6 px-2.5 border-r-gray-200 border-r border-solid transition-all ease-in-out duration-300 bg-white ${
          isNavigatorOpen ? "translate-x-0" : "-translate-x-full -mr-[288px]"
        }
      `}
      >
        <div className="h-full flex flex-col">
          <div className="mb-8 max-md:mb-5 h-11 max-md:h-9 flex flex-row items-center justify-center gap-2">
            <CreateChatRoomButton onClickInnerButton={onClickInnerButton} />
            <button
              type="button"
              className="drawer-close-button border border-gray-300 rounded h-full w-11 max-md:w-9 hover:bg-gray-100 transition flex items-center justify-center"
              onClick={() => setIsNavigatorOpen(false)}
            >
              <Image src="/svg/drawer.svg" alt="drawer" height="20" width="20" />
            </button>
          </div>
          <div className="grow flex">
            <NavigatorBox onClickInnerButton={onClickInnerButton} />
          </div>
          <div className="border-t-2 border-solid border-gray-400">
            <DeleteAllChatroomButton />
            <NavigatorToolBox />
          </div>
        </div>
      </nav>
      <div className="fixed left-4 top-6 max-md:top-8 z-[15]" ref={navOpenButton}>
        <button
          type="button"
          className="drawer-close-button border border-gray-300 rounded h-11 w-11 max-md:h-7 max-md:w-7 hover:bg-gray-100 transition flex items-center justify-center"
          onClick={() => setIsNavigatorOpen(true)}
        >
          <Image src="/svg/drawer.svg" alt="drawer" height="20" width="20" />
        </button>
      </div>
    </>
  )
}
