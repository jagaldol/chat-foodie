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
  const [tooltipFoodId, setTooltipFoodId] = useState<number | null>(null)

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
      <div className="flex flex-col items-center mt-10">
        <div className="flex flex-wrap justify-between mx-9">
          {foodList
            .filter((_, index) => {
              const startIndex = (currentPage - 1) * foodsPerPage
              return startIndex <= index && index < startIndex + foodsPerPage
            })
            .map((food) => {
              return (
                <button type="button" onClick={() => handleFoodClick(food.id)} key={food.id}>
                  <div
                    className={`${
                      selectedFoods.includes(food.id) ? "ring-2 ring-orange-500 " : ""
                    } mb-9 rounded-md overflow-hidden`}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}${food.imageUrl}`}
                      alt={food.name}
                      width={150}
                      height={100}
                      onMouseEnter={() => setTooltipFoodId(food.id)}
                      onMouseLeave={() => setTooltipFoodId(null)}
                    />
                    {tooltipFoodId === food.id && (
                      <div className="absolute bg-white p-2 rounded-md shadow-md">
                        {food.name} {/* 원하는 음식 정보 표시 */}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
        </div>
        <div className="mt-3">
          <button
            type="button"
            onClick={() => {
              if (currentPage === 5) {
                handleSendSelection()
              } else {
                setCurrentPage(currentPage + 1)
              }
            }}
            className="w-80 h-12 bg-main-theme text-white rounded-md mb-1"
          >
            Continue({currentPage}/5)
          </button>
        </div>
      </div>
    </Modal>
  )
}
