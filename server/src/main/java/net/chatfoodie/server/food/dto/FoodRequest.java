package net.chatfoodie.server.food.dto;

import net.chatfoodie.server.food.Food;

import java.util.List;

public class FoodRequest {

    public record SaveUserFoodPreferenceDto(Long Id) {
        public SaveUserFoodPreferenceDto(Food food) {
            this(food.getId());
        }
    }
}