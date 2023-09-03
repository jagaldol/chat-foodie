import React from "react"
import titleFont from "@/styles/TitleFont"

export default function Home() {
  const homeStyle: React.CSSProperties = {
    backgroundColor: "#D3D9DD",
    minHeight: "100vh", // 최소 높이로 설정
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  }

  const divstyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // 수직 방향 가운데 정렬
    justifyContent: "center", // 수평 방향 가운데 정렬
    height: "100%",
    width: "100vw",
    minHeight: "100vh",
  }

  const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "auto", // 이미지 높이를 자동으로 조정
    position: "relative", // 상대 위치 설정
    zIndex: 1,
    objectFit: "cover",
  }

  const buttonStyle: React.CSSProperties = {
    marginRight: "0.8rem",
    position: "absolute",
    zIndex: 2,
    display: "flex", // 수정된 부분: 버튼 안의 요소들을 수평, 수직 중앙으로 정렬하기 위해 display를 flex로 변경합니다.
    flexDirection: "column", // 추가된 부분: 버튼 안의 요소들을 세로 방향으로 정렬합니다.
    alignItems: "center", // 수정된 부분: 수직 방향 가운데 정렬
    justifyContent: "center", // 수정된 부분: 수평 방향 가운데 정렬
  }

  const logoStyle: React.CSSProperties = {
    marginTop: "9.5rem",
    display: "flex",
    alignItems: "center",
    color: "#F56C00",
    fontSize: "33px",
    filter: "drop-shadow(1px 1px 1px black)",
    margin: 0,
  }

  const chatStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    color: "#F56C00",
    borderRadius: "30px",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    border: "2px solid #F56C00",
    width: "259px",
    textAlign: "center",
  }

  const footerStyle: React.CSSProperties = {
    backgroundColor: "#D3D9DD",
    bottom: 0,
    paddingBottom: "2px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
    fontSize: "12px",
    color: "#666666",
  }

  const infoStyle: React.CSSProperties = {
    lineHeight: "2",
  }

  const mobileMediaQuery = "@media (max-width: 767px)"

  return (
    <div style={homeStyle}>
      <div style={divstyle}>
        <img src="/svg/first.svg" alt="Background" style={imageStyle} />
        <div style={buttonStyle}>
          <div className="basis-1/3 flex flex-col justify-center">
            <div style={logoStyle}>
              <div className="mt-1 min-w-fit">
                <img src="/svg/logo.svg" alt="logo" width={65} height={65} className="max-md:h-6 max-md:w-6" />
              </div>
              <h1 className={`font-bold ${titleFont.className}`} style={{ margin: 0 }}>
                Chatfoodie
              </h1>
            </div>
            <p style={{ textAlign: "center", margin: "10px 0" }}>음식 추천의 전문가 foodie와 채팅을 해보세요!</p>
          </div>
          <a href="/chat" className="text-main-theme" style={chatStyle}>
            채팅 하러 가기
          </a>
        </div>
      </div>
      <div style={infoStyle}>
        <div className="mt-10 text-center">
          <h2 className="text-2xl font-semibold">Chatfoodie는...</h2>
          <p className="text-lg mt-2">
            LLM(Large Language Model)을 파인튜닝한 <b>음식 추천을 위한 챗봇 서비스</b>입니다.
            <br />
            <br /> 최근 거대 언어 모델(LLM)의 발전으로 인해 chatGPT와 같은 대화형 챗봇이 많이 개발되고 있습니다. <br />
            이러한 대화형 챗봇은 사용자와의 대화를 통해 사용자의 요구에 맞는 맞춤형 대답을 생성하게 됩니다. <br />
            저희 팀은 LLM의 이런 특성에 착안하여 대화를 통해 편리하게 원하는 음식을 추천 받을 수 있는 음식 추천 챗봇을
            개발하였습니다..
          </p>
          <br />
          <br />
          <br />
          <br />
          <h2 className="text-2xl font-semibold">모델 학습</h2>
          <div style={{ display: "flex" }}>
            <p style={{ marginRight: "20px" }}>
              베이스 모델로 KoAlpaca-polyglot-5.8B를 사용하였습니다.
              <br /> QLoRA 기법을 이용하여 Colab 무료 버전으로 학습을
              <br />
              진행하였습니다.
            </p>
            <img src="/svg/trainingLoss.svg" alt="loss" width={400} height={316} />
          </div>
          <h2 className="text-2xl font-semibold">개발 팀</h2>
          <p>2023년 부산대학교 정보컴퓨터공학부 졸업과제 - 팀 쩝쩝학사</p>
          <ul className="text-lg mt-2">
            <li>안혜준(팀장)</li>
            <li>박성민</li>
            <li>박진영</li>
          </ul>
        </div>
      </div>
      <footer style={footerStyle}>
        <p>
          &copy; Chatfoodie. All right reserved. food recommendation chatbot with LLM.food recommendation chatbot with
          LLM.
        </p>
      </footer>
    </div>
  )
}
