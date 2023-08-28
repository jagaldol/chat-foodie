import React from "react"
import Image from "next/image"

export default function Drawer({ onClick }: { onClick: () => void }) {
  return (
    <div>
      <div className="drawer-content">
        <button
          type="button"
          className="drawer-close-button border border-gray-300 rounded h-11 w-11 hover:bg-gray-100 transition p-3"
          onClick={onClick}
        >
          <Image src="/svg/drawer.svg" alt="drawer" height="20" width="20" />
        </button>
      </div>
    </div>
  )
}
