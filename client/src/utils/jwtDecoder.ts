const tokenKey = "jwt"

export function saveJwt(jwt: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(tokenKey, jwt)
  }
}

export function deleteJwt() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(tokenKey)
  }
}

export function getJwtPayload(jwtString?: string) {
  let jwt = ""
  if (jwtString) {
    jwt = jwtString
  } else if (typeof window !== "undefined") {
    const value = localStorage.getItem(tokenKey)
    jwt = value ?? jwt
  }
  if (jwt === null) return null
  const jwtParts = jwt.split(".")
  if (!jwt.startsWith("Bearer ") || jwtParts.length !== 3) {
    return null
  }
  const decodedPayload = atob(jwtParts[1])
  return JSON.parse(decodedPayload)
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

export function getJwtTokenFromStorage() {
  if (typeof window === "undefined") {
    return null
  }
  return localStorage.getItem(tokenKey)
}
