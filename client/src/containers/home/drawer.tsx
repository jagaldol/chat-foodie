import React from "react"
import Image from "next/image"

export default function Drawer({ onClick }: { onClick: () => void }) {
  return (
    <div>
      <div className="drawer-content">
        <button type="button" className="drawer-close-button" onClick={onClick}>
          <Image src="/svg/drawer.svg" alt="drawer" height="20" width="20" className="m-3" />
        </button>
      </div>
    </div>
  )
}
