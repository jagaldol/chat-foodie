const sessionKey = "jwt"

export function saveJwt(jwt: string) {
  sessionStorage.setItem(sessionKey, jwt)
}

export function deleteJwt() {
  sessionStorage.removeItem(sessionKey)
}

export function getJwtPayload(jwtString?: string) {
  let jwt: string | null
  if (jwtString === undefined) {
    jwt = sessionStorage.getItem(sessionKey)
  } else {
    jwt = jwtString
  }

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
