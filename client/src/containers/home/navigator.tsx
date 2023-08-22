import React from "react"

import NavigatorBox from "@/containers/home/navigatorBox"
import NavigatorToolBox from "@/containers/home/navigatorToollBox"
import CreateChatRoomButton from "@/containers/home/createChatRoomButton"
import DeleteAllChatroomButton from "@/containers/home/deleteAllChatroomButton"

export default function Navigator() {
  return (
    <nav className="flex flex-col min-w-[18rem] p-2.5 border-r-gray-200 border-r border-solid">
      <div className="h-full flex flex-col">
        <div className="mb-8 border-solid border border-gray-300 rounded-md h-11 flex items-center hover:bg-gray-100 hover:border-gray-200 transition">
          <CreateChatRoomButton />
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
  )
}
