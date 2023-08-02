package net.chatfoodie.server.food.dto;

import net.chatfoodie.server.food.Food;


public class FoodRequest {

    public record SaveUserFoodPreferenceDto(Long Id) {
        public Food savepreference()
        {
            return Food.builder()
                    .id(Id)
                    .build();
        }
    }
}