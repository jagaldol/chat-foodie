import React, { useState, useEffect } from "react"
import Image from "next/image"
import Modal from "@/components/modal"
import proxy from "@/utils/proxy"
import { getJwtTokenFromStorage } from "@/utils/jwtDecoder"
import { FoodDto } from "@/types/foodpreference"

export default function PreferenceModal({ onClickClose }: { onClickClose(): void }) {
  const [foodList, setFoodList] = useState<FoodDto[]>([]) // 초기 데이터 설정
  const [loading, setLoading] = useState<boolean>(false) // 서버 사이드 렌더링이므로 로딩 상태를 초기에 false로 설정
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedFoods, setSelectedFoods] = useState<number[]>([])

  const foodsPerPage = 6

  useEffect(() => {
    setLoading(true)
    proxy
      .get("/foods/random")
      .then((res) => {
        setFoodList(res.data.response.foods)
      })
      .catch((res) => {
        alert(res.response.data.errorMessage)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleFoodClick = (foodId: number) => {
    if (selectedFoods.includes(foodId)) {
      setSelectedFoods(selectedFoods.filter((id) => id !== foodId))
    } else {
      setSelectedFoods([...selectedFoods, foodId])
    }
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const renderFoods = () => {
    if (!foodList) {
      return null
    }

    const startIndex = (currentPage - 1) * foodsPerPage
    const foodsOnPage = foodList.slice(startIndex, startIndex + foodsPerPage)

    return foodsOnPage.map((food) => (
      <div key={food.id} className={`food ${selectedFoods.includes(food.id) ? "selected-food" : "unselected-food"}`}>
        <button
          type="button"
          onClick={() => handleFoodClick(food.id)}
          className={`food-button ${selectedFoods.includes(food.id) ? "selected" : ""}`}
        >
          <div
            className={`food-image ${
              selectedFoods.includes(food.id) ? "selected-image ring-2 ring-orange-500" : "unselected-image"
            } p-2 rounded-md`}
          >
            <Image src={`${process.env.NEXT_PUBLIC_API_URL}${food.imageUrl}`} alt={food.name} width={140} height={95} />
          </div>
          <p>{food.name}</p>
        </button>
      </div>
    ))
  }

  const handleSendSelection = () => {
    // 선택한 음식의 리스트를 서버로 전송하는 로직 추가
    if (selectedFoods.length === 0) {
      alert("하나 이상의 음식을 선택해 주세요")
      return
    }

    const jwtToken = getJwtTokenFromStorage()

    const headers = {
      Authorization: jwtToken,
    }

    const requestData = {
      foodIds: selectedFoods,
    }

    // 서버로 선택한 음식 ID 리스트를 전송하는 로직 추가
    proxy
      .post("/favors", requestData, {
        headers, // headers 객체를 직접 넣어줘야 합니다.
      })
      .then(() => {
        alert("선호하는 음식이 저장되었습니다!")
        onClickClose()
      })
      .catch(() => {
        alert("오류가 발생하였습니다.")
      })
  }

  return (
    <Modal onClickClose={onClickClose}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col items-center">
          <div className="flex flex-wrap justify-center foods-container">{renderFoods()}</div>
          <div className="text-center mt-3">Page {currentPage} / 5</div>
          <div className="flex justify-center mt-3 space-x-2">
            {currentPage > 1 && (
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                이전
              </button>
            )}
            {currentPage < 5 && (
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
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
      )}
    </Modal>
  )
}
