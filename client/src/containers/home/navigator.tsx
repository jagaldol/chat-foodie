import React from "react"

import NavigatorBox from "@/containers/home/navigatorBox"

export default function Navigator() {
  return (
    <nav className="flex flex-col min-w-[18rem] p-2.5 border-r-gray-200 border-r border-solid">
      <NavigatorBox />
    </nav>
  )
}
