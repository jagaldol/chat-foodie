import React, { useState, useEffect } from "react"
import Image from "next/image"
import Modal from "@/components/modal"
import proxy from "@/utils/proxy"
import { getJwtTokenFromStorage } from "@/utils/jwtDecoder"
import { FoodDto } from "@/types/foodpreference"

export default function PreferenceModal({ onClickClose }: { onClickClose(): void }) {
  const [foodList, setFoodList] = useState<FoodDto[]>([]) // 초기 데이터 설정
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedFoods, setSelectedFoods] = useState<number[]>([])

  const foodsPerPage = 6

  const handleFoodClick = (foodId: number) => {
    if (selectedFoods.includes(foodId)) {
      setSelectedFoods(selectedFoods.filter((id) => id !== foodId))
    } else {
      setSelectedFoods([...selectedFoods, foodId])
    }
  }

  const handleSendSelection = () => {
    const headers = {
      Authorization: getJwtTokenFromStorage(),
    }
    const requestData = {
      foodIds: selectedFoods,
    }

    proxy
      .post("/favors", requestData, { headers })
      .then(() => {
        alert("선호하는 음식이 저장되었습니다!")
        onClickClose()
      })
      .catch(() => {
        alert("오류가 발생하였습니다.")
      })
  }

  useEffect(() => {
    proxy
      .get("/foods/random")
      .then((res) => {
        setFoodList(res.data.response.foods)
      })
      .catch((res) => {
        alert(res.response.data.errorMessage)
      })
  }, [])

  return (
    <Modal onClickClose={onClickClose} description="선호 하는 음식들을 선택해주세요.">
      <div className="flex flex-col items-center">
        <div className="flex flex-wrap justify-center">
          {foodList
            .filter((_, index) => {
              const startIndex = (currentPage - 1) * foodsPerPage
              return startIndex <= index && index < startIndex + foodsPerPage
            })
            .map((food) => {
              return (
                <button type="button" onClick={() => handleFoodClick(food.id)} key={food.id}>
                  <div className={`${selectedFoods.includes(food.id) ? "ring-2 ring-orange-500 " : ""}m-2 rounded-md`}>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}${food.imageUrl}`}
                      alt={food.name}
                      width={140}
                      height={95}
                      style={{ height: "95px" }}
                    />
                  </div>
                  <p>{food.name}</p>
                </button>
              )
            })}
        </div>
        <div className="text-center mt-3">Page {currentPage} / 5</div>
        <div className="flex justify-center mt-3 space-x-2">
          {currentPage > 1 && (
            <button
              type="button"
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              이전
            </button>
          )}
          {currentPage < 5 && (
            <button
              type="button"
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              다음
            </button>
          )}
          {currentPage === 5 && (
            <button
              type="submit"
              onClick={handleSendSelection}
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              저장
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
