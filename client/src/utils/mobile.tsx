import { useEffect, useState } from "react"
import { useMediaQuery } from "react-responsive"

const Mobile = () => {
  const [mobile, setMobile] = useState<boolean>(false)
  const isMobile = useMediaQuery({ maxWidth: 768 })

  useEffect(() => {
    const checkResize = () => {
      if (isMobile) {
        setMobile(true)
      } else {
        setMobile(false)
      }
    }
    checkResize()
  }, [isMobile])

  return mobile
}

export default Mobile
