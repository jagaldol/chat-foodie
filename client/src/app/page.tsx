import React from "react"
import Image from "next/image"
import titleFont from "@/styles/TitleFont"

export default function Home() {
  return (
    <div className="bg-[#D3D9DD] w-full flex flex-col justify-center relative">
      <div className="flex flex-col items-center justify-center h-screen w-full">
        <Image
          src="/svg/first.svg"
          width={100}
          height={100}
          alt=""
          className="w-full h-auto relative z-0 object-cover"
        />
        <div className="absolute flex flex-col justify-center items-center">
          <div className="flex items-center drop-shadow-[3px_3px_2px_rgba(0,0,0,0.5)]">
            <Image src="/svg/logo.svg" alt="logo" width={65} height={65} className="max-md:h-6 max-md:w-6" />
            <h1 className={`font-bold ${titleFont.className} text-6xl text-main-theme`}>Chatfoodie</h1>
          </div>
          <p className="text-center my-2.5">음식 추천의 전문가 foodie와 채팅을 해보세요!</p>
          <a
            href="/chat"
            className="text-main-theme py-2.5 bg-gray-50 rounded-full font-bold border-main-theme border-2 w-64 text-center"
          >
            채팅 하러 가기
          </a>
        </div>
      </div>
      <div className="leading-loose">
        <div className="my-20 mx-56">
          <div className="pt-32">
            <h2 className="text-2xl font-semibold">Chatfoodie는...</h2>
            <p className="text-lg mt-2">
              LLM(Large Language Model)을 파인튜닝한 <b>음식 추천을 위한 챗봇 서비스</b>입니다.
              <br />
              <br /> 최근 거대 언어 모델(LLM)의 발전으로 인해 chatGPT와 같은 대화형 챗봇이 많이 개발되고 있습니다.{" "}
              <br />
              이러한 대화형 챗봇은 사용자와의 대화를 통해 사용자의 요구에 맞는 맞춤형 대답을 생성하게 됩니다. <br />
              저희 팀은 LLM의 이런 특성에 착안하여 대화를 통해 편리하게 원하는 음식을 추천 받을 수 있는 음식 추천 챗봇을
              개발하였습니다.
            </p>
          </div>
          <div className="pt-32">
            <h2 className="text-2xl font-semibold">모델 학습</h2>
            <div style={{ display: "flex" }}>
              <p style={{ marginRight: "20px" }}>
                베이스 모델로 KoAlpaca-polyglot-5.8B를 사용하였습니다.
                <br /> QLoRA 기법을 이용하여 Colab 무료 버전으로 학습을
                <br />
                진행하였습니다.
              </p>
              <Image src="/svg/trainingLoss.svg" alt="loss" width={400} height={316} />
            </div>
          </div>
          <div className="pt-32">
            <h2 className="text-2xl font-semibold">개발 팀</h2>
            <p>2023년 부산대학교 정보컴퓨터공학부 졸업과제 - 팀 쩝쩝학사</p>
            <ul className="text-lg mt-2 list-disc list-inside">
              <li>안혜준(팀장)</li>
              <li>박성민</li>
              <li>박진영</li>
            </ul>
          </div>
        </div>
      </div>
      <footer className="flex flex-col justify-center items-center text-xs text-[#666666] mt-10 mb-1">
        <p>
          &copy; Chatfoodie. All right reserved. food recommendation chatbot with LLM.food recommendation chatbot with
          LLM.
        </p>
      </footer>
    </div>
  )
}
