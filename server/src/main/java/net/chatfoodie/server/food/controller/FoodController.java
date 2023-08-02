package net.chatfoodie.server.food.controller;

import lombok.RequiredArgsConstructor;
import net.chatfoodie.server._core.utils.ApiUtils;
import net.chatfoodie.server.food.Food;
import net.chatfoodie.server.food.dto.FoodRequest;
import net.chatfoodie.server.food.repository.FoodRepository;
import net.chatfoodie.server.food.service.FoodService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class FoodController {

    final private FoodService foodService;
    public FoodController(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }

    @GetMapping("foods/getRandomFoods")
    public List<foods> getRandomFoods() {

    }
    @PostMapping("/saveUserFoodPreference")
    public ResponseEntity<String> saveUserFoodPreference
            (@RequestBody FoodRequest.SaveUserFoodPreferenceDto requestDto) {
        foodService.saveUserFoodPreference(requestDto);
        return null;
    }
}
