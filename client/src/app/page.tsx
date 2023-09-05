import React, { ReactNode } from "react"
import Image from "next/image"
import titleFont from "@/styles/TitleFont"

function ParagraphBox({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="pt-32">
      <h2 className="text-3xl font-semibold max-md:text-xl">{title}</h2>
      <div className="leading-10 mt-10 max-md:text-sm max-md:leading-8 max-sm:text-xs max-sm:leading-7">{children}</div>
    </div>
  )
}

function ImageBox({ src, caption }: { src: string; caption: string }) {
  return (
    <figure>
      <div className="relative w-[300px] h-[225px] max-md:w-64 max-md:h-48">
        <Image src={src} alt="loss" fill />
      </div>
      <figcaption className="text-center text-sm leading-8 max-sm:text-xs max-sm:leading-7">{caption}</figcaption>
    </figure>
  )
}

export default function Home() {
  return (
    <div className="bg-[#D3D9DD] w-full flex flex-col justify-center items-center relative">
      <div className="absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-transparent to-[#D3D9DD] z-10" />
      <div className="flex flex-col items-center justify-center h-screen w-full bg-[url('/assets/first.png')] bg-cover bg-center">
        <div className="absolute flex flex-col justify-center items-center z-20">
          <div className="flex items-center drop-shadow-[3px_3px_2px_rgba(0,0,0,0.5)]">
            <Image src="/svg/logo.svg" alt="logo" width={65} height={65} className="max-sm:h-10 max-sm:w-10" />
            <h1 className={`font-bold ${titleFont.className} text-6xl max-sm:text-4xl text-main-theme`}>Chatfoodie</h1>
          </div>
          <p className="text-center mb-5 max-sm:mb-3 max-sm:text-xs">음식 추천의 전문가 foodie와 채팅을 해보세요!</p>
          <a
            href="/chat"
            className="text-main-theme py-2.5 max-sm:py-1 bg-gray-50 rounded-full font-bold border-main-theme border-2 w-64 max-sm:w-40 text-center max-sm:text-sm"
          >
            채팅 하러 가기
          </a>
        </div>
      </div>
      <div className="my-20 w-[800px] max-lg:w-[700px] max-md:w-full max-md:px-10 max-sm:px-5">
        <ParagraphBox title="Chatfoodie는...">
          <p>
            LLM(Large Language Model)을 파인튜닝한 <b>음식 추천을 위한 챗봇 서비스</b>입니다.
          </p>
          <br />
          <p className="indent-4">
            최근 거대 언어 모델(LLM)의 발전으로 인해 chatGPT와 같은 대화형 챗봇이 많이 개발되고 있습니다. 이러한 대화형
            챗봇은 사용자와의 대화를 통해 사용자의 요구에 맞는 맞춤형 대답을 생성하게 됩니다. 저희 팀은 LLM의 이런
            특성에 착안하여 대화를 통해 편리하게 원하는 음식을 추천 받을 수 있는 음식 추천 챗봇을 개발하였습니다.
          </p>
        </ParagraphBox>
        <ParagraphBox title="AI 언어 모델">
          <p>
            저희 <b>푸디 AI</b>는 <b>KoAlpaca-polyglot-5.8B</b>의 베이스 모델 위에서 fine-tuning(LoRA)을 거쳐
            만들어졌습니다.
          </p>
          <br />
          <div className="flex max-sm:flex-col">
            <div className="mr-5">
              <p>
                Polyglot-ko는 한국어 데이터로 학습된 다국어 초거대 언어모델 개발 프로젝트로 한국어 성능이 타 LLM보다
                우수합니다. KoAlpaca-polyglot-5.8B는 한국어에 강점을 보이는 polyglot-ko를 KoAlpaca에서 챗봇 용도로
                학습시켜 놓은 모델입니다.
              </p>
            </div>
            <div className="flex shrink-0 justify-center max-sm:mt-10">
              <ImageBox src="/assets/polyglot-ko-copa.jpg" caption="한국어 언어 모델들의 성능" />
            </div>
          </div>
          <br />
          <div className="flex max-sm:flex-col-reverse">
            <div className="flex shrink-0 justify-center max-sm:mt-10 mr-5">
              <ImageBox src="/assets/train-loss-5epoch.png" caption="학습률 - traing loss" />
            </div>
            <div>
              <p>
                SNS 대화 데이터(AI hub)와 Wikipedia의 음식 정보를 바탕으로 GPT를 사용한 <b>self-instruct</b>를
                수행하였고 최종 8000개의 학습 데이터를 이용하였습니다. 학습의 경우, <b>QLoRA 기법</b>을 이용하여 Colab
                무료 버전으로 학습을 진행할 수 있습니다.
              </p>
            </div>
          </div>
        </ParagraphBox>
        <ParagraphBox title="개발 팀">
          <p>
            2023년 부산대학교 정보컴퓨터공학부 졸업과제 - <b className="whitespace-nowrap">팀 쩝쩝학사</b>
          </p>
          <ul className="mt-2 list-disc list-inside">
            <li>🚩안혜준(팀장)</li>
            <li>💻박성민</li>
            <li>💻박진영</li>
          </ul>
        </ParagraphBox>
      </div>
      <footer className="flex max-md:flex-col justify-center text-center text-xs text-[#444654] mt-10 mb-5">
        <p>&copy; Chatfoodie. All right reserved.</p>
        <p>food recommendation chatbot with LLM.</p>
      </footer>
    </div>
  )
}
