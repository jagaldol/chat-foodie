/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
}

module.exports = {
  images: {
    domains: ["localhost", "chatfoodie.net", "foodie.jagaldol.com"], // 이미지를 호스팅하는 도메인을 여기에 추가
    unoptimized: true,
  },
  ...nextConfig,
}
