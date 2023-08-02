package net.chatfoodie.server.food.dto;

import net.chatfoodie.server._core.utils.Utils;
import net.chatfoodie.server.food.Food;
import net.chatfoodie.server.user.User;

import java.util.List;

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