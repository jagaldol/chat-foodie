package net.chatfoodie.server.food.controller;

import lombok.RequiredArgsConstructor;
import net.chatfoodie.server._core.utils.ApiUtils;
import net.chatfoodie.server.food.dto.FoodRequest;
import net.chatfoodie.server.food.dto.FoodResponse;
import net.chatfoodie.server.food.service.FoodService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
public class FoodController {

    final private FoodService foodService;

    @GetMapping("foods/random")
    public ResponseEntity<?> getRandomFoods(@RequestParam(value = "size",defaultValue = "30")
                                                                  Integer size) {
        FoodResponse.FindAllDto responseDto = foodService.getRandomFoods(size);
        ApiUtils.Response<?> response = ApiUtils.success(responseDto);
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("foods/saveUserFoodPreference")
    public ResponseEntity<?> saveUserFoodPreference(@RequestBody FoodRequest.SaveUserFoodPreferenceDto requestDto) {
        foodService.saveUserFoodPreference(requestDto);
        ApiUtils.Response<?> response = ApiUtils.success();
        return ResponseEntity.ok().body(response);
    }
}
