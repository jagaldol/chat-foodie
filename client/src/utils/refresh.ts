import axios, { InternalAxiosRequestConfig } from "axios"
import { deleteJwt, getJwtExp, saveJwt } from "@/utils/jwtDecoder"

const refresh = async (config: InternalAxiosRequestConfig) => {
  const jwtExp = getJwtExp()
  const newConfig = config
  if (jwtExp != null && jwtExp * 1000 < Date.now()) {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/authentication`, null, {
      withCredentials: true,
    })

    const jwt = res.headers.authorization
    saveJwt(jwt)
    newConfig.headers.Authorization = jwt
  }
  return newConfig
}

const refreshErrorHandle = () => {
  deleteJwt()
}

export { refresh, refreshErrorHandle }
