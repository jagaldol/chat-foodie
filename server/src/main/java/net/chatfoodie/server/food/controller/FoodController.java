package net.chatfoodie.server.food.controller;

import lombok.RequiredArgsConstructor;
import net.chatfoodie.server._core.utils.ApiUtils;
import net.chatfoodie.server.food.Food;
import net.chatfoodie.server.food.dto.FoodRequest;
import net.chatfoodie.server.food.dto.FoodResponse;
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

    @GetMapping("foods/random")
    public ResponseEntity<FoodResponse.FindAllDto> getRandomFoods(@RequestParam(value = "size",defaultValue = "30")
                                                                  Integer size) {
        FoodResponse.FindAllDto responseDto = foodService.getRandomFoods(size);
        return ResponseEntity.ok(responseDto);
    }

    @PostMapping("foods/saveUserFoodPreference")
    public ResponseEntity<String> saveUserFoodPreference(@RequestBody FoodRequest.SaveUserFoodPreferenceDto requestDto) {
        foodService.saveUserFoodPreference(requestDto);
        return ResponseEntity.ok("ok");
    }
}
