import axios, { InternalAxiosRequestConfig } from "axios"
import { deleteJwt, getJwtExp, getJwtTokenFromStorage, saveJwt } from "@/utils/jwtDecoder"

type RefreshCallback = (newToken: string) => void

let isRefreshing = false
let refreshSubscribers: RefreshCallback[] = []

function subscribeTokenRefresh(cb: RefreshCallback) {
  refreshSubscribers.push(cb)
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token))
  refreshSubscribers = []
}

const refresh = async (config: InternalAxiosRequestConfig) => {
  const jwtExp = getJwtExp()
  const newConfig = config
  if (jwtExp != null && jwtExp * 1000 < Date.now()) {
    if (!isRefreshing) {
      try {
        isRefreshing = true
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/authentication`, null, {
          withCredentials: true,
        })

        const jwt = res.headers.authorization
        saveJwt(jwt)
        onRefreshed(jwt)
        newConfig.headers.Authorization = jwt
      } catch (e) {
        deleteJwt()
      } finally {
        isRefreshing = false
      }
    } else {
      await new Promise((resolve) => {
        subscribeTokenRefresh((token: string) => {
          newConfig.headers.Authorization = token
          resolve(token)
        })
      })
    }
  } else {
    newConfig.headers.Authorization = getJwtTokenFromStorage()
  }
  return newConfig
}

const refreshErrorHandle = () => {}

export { refresh, refreshErrorHandle }
