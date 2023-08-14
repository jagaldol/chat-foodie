const sessionKey = "jwt"

export function saveJwt(jwt: string) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(sessionKey, jwt)
  }
}

export function deleteJwt() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(sessionKey)
  }
}

export function getJwtPayload(jwtString?: string) {
  let jwt = ""
  if (jwtString) {
    jwt = jwtString
  } else if (typeof window !== "undefined") {
    const value = sessionStorage.getItem(sessionKey)
    jwt = value || jwt
  }
  console.log(jwt)
  if (jwt === null) return null
  const jwtParts = jwt.split(".")
  if (!jwt.startsWith("Bearer ") || jwtParts.length !== 3) {
    deleteJwt()
    return null
  }
  const decodedPayload = atob(jwtParts[1])
  const payload = JSON.parse(decodedPayload)

  const expirationTime = payload.exp * 1000
  const currentTimestamp = Date.now()

  if (currentTimestamp > expirationTime) {
    deleteJwt()
    return null
  }
  return payload
}

export function getJwtExp(jwtString?: string) {
  const payload = getJwtPayload(jwtString)
  return payload ? payload.exp : null
}

export function getJwtId(jwtString?: string) {
  const payload = getJwtPayload(jwtString)
  return payload ? payload.id : null
}

export function getJwtRole(jwtString?: string) {
  const payload = getJwtPayload(jwtString)
  return payload ? payload.role : null
}
