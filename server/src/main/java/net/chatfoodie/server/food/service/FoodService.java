package net.chatfoodie.server.food.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server.food.Food;
import net.chatfoodie.server.food.dto.FoodRequest;
import net.chatfoodie.server.food.dto.FoodResponse;
import net.chatfoodie.server.food.repository.FoodRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Collections;
import java.util.List;


@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class FoodService {
    final private FoodRepository foodRepository;

    @Transactional
    public FoodResponse.FindAllDto getRandomFoods(Integer size) {
        // TODO: 음식이 많아졌을 때 처음부터 랜덤하게 30개만 db에서 들고 오도록 개선 필요
        List<Food> allFoods = foodRepository.findAll();

        Collections.shuffle(allFoods);
        List<Food> randomFoods = allFoods.subList(0, Math.min(size, allFoods.size()));

        return FoodResponse.FindAllDto.of(randomFoods);
    }

    public void saveUserFoodPreference(FoodRequest.SaveUserFoodPreferenceDto requestDto){
        foodRepository.save(requestDto.savepreference());
    }
}
