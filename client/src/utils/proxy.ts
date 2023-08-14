import axios, { AxiosRequestConfig } from "axios"

const proxy = {
  proxyUrl: "http://localhost:8080/api",
  getUrl(url: string) {
    return this.proxyUrl + url
  },
  getConf(conf: AxiosRequestConfig<any> | undefined) {
    let newConf: any = {}
    if (conf !== null && typeof conf !== "undefined") newConf = { ...conf }
    newConf.withCredentials = true
    return newConf
  },
  put(url: string, data: object | undefined, conf: AxiosRequestConfig<any> | undefined) {
    const convertedUrl = this.getUrl(url)
    return axios.put(convertedUrl, data, this.getConf(conf))
  },
  delete(url: string, data: object | undefined, conf: AxiosRequestConfig<any> | undefined) {
    const convertedUrl = this.getUrl(url)
    return axios.delete(convertedUrl, this.getConf(conf))
  },
  post(url: string, data: object | undefined, conf: AxiosRequestConfig<any> | undefined) {
    const convertedUrl = this.getUrl(url)
    return axios.post(convertedUrl, data, this.getConf(conf))
  },
  get(url: string, conf: AxiosRequestConfig<any> | undefined) {
    const convertedUrl = this.getUrl(url)
    return axios.get(convertedUrl, this.getConf(conf))
  },
}
export default proxy
