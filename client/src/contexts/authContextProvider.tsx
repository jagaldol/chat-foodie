"use client"

import { createContext, ReactNode, useEffect, useMemo, useState } from "react"
import { deleteJwt, getJwtPayload } from "@/utils/jwtDecoder"

export const AuthContext = createContext<any>({})

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState(0)
  const [userRole, setUserRole] = useState("ROLE_PENDING")
  const [isLoad, setIsLoad] = useState(false)
  const [update, setUpdate] = useState(false)

  const value = useMemo(
    () => ({
      userId,
      setUserId,
      userRole,
      setUserRole,
      isLoad,
      needUpdate: () => {
        setUpdate((u) => !u)
        setIsLoad(false)
      },
    }),
    [userId, userRole, isLoad],
  )

  useEffect(() => {
    const payload = getJwtPayload()
    if (payload === null) {
      setUserId(0)
      setUserRole("ROLE_PENDING")
      deleteJwt()
    } else {
      setUserId(payload.id)
      setUserRole(payload.role)
    }
    setIsLoad(true)
  }, [update])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
