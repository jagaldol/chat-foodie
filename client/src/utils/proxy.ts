import axios from "axios"
import { refresh, refreshErrorHandle } from "@/utils/refresh"

const proxy = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
})

proxy.interceptors.request.use(refresh, refreshErrorHandle)

export default proxy
