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
        className={`absolute h-full z-10 flex flex-col min-w-[288px] py-9 px-2.5 border-r-gray-200 border-r border-solid transition-all ease-in-out duration-300 bg-white ${
          isNavigatorOpen ? "translate-x-0" : "-translate-x-full -mr-[288px]"
        }
      `}
      >
        <div className="h-full flex flex-col">
          <div className="mb-8 h-11 flex flex-row items-center justify-center gap-2">
            <CreateChatRoomButton onClickInnerButton={onClickInnerButton} />
            <div>
              <div className="drawer-content">
                <button
                  type="button"
                  className="drawer-close-button border border-gray-300 rounded h-11 w-11 hover:bg-gray-100 transition flex items-center justify-center"
                  onClick={() => setIsNavigatorOpen(false)}
                >
                  <Image src="/svg/drawer.svg" alt="drawer" height="20" width="20" />
                </button>
              </div>
            </div>
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
      <div className="left-4 top-5 absolute" ref={navOpenButton}>
        <div>
          <div className="drawer-content">
            <button
              type="button"
              className="drawer-close-button border border-gray-300 rounded h-11 w-11 max-md:h-7 max-md:w-7 hover:bg-gray-100 transition flex items-center justify-center"
              onClick={() => setIsNavigatorOpen(true)}
            >
              <Image src="/svg/drawer.svg" alt="drawer" height="20" width="20" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
