import React from "react"
import Image from "next/image"

export default function Drawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <div className={`drawer ${isOpen ? "open" : ""}`}>
      <div className="drawer-content">
        <button type="button" className="drawer-close-button" onClick={onClose}>
          <Image src="/svg/drawer.svg" alt="drawer" height="20" width="20" className="m-3" />
        </button>
      </div>
    </div>
  )
}
