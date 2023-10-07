import "@/styles/globals.css"
import { ReactNode } from "react"
import { Noto_Sans_KR } from "next/font/google"

const notoSans = Noto_Sans_KR({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Malgun Gothic", "Roboto", "sans-serif"],
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="msapplication-config" content="/favicons/browserconfig.xml" />
        <meta name="theme-color" content="#ffffff" />
        <title>Chat Foodie</title>
        <meta name="description" content="음식 추천의 전문가 푸디와 채팅을 해보세요!" />
        <meta name="google-site-verification" content="_zlrUaOkEzsPvjsjSNobRlNAgF7AiOGLTd3BxabFeYw" />
        <meta name="naver-site-verification" content="aa155d77ad39e4ba129761f1094b41555998d860" />
      </head>
      <body
        className={`${notoSans.className} flex box-border`}
        style={{
          minHeight: "calc(var(--vh, 1vh) * 100)",
          margin: 0,
          padding: 0,
        }}
      >
        {children}
      </body>
    </html>
  )
}
