package net.chatfoodie.server.favor.dto;

import net.chatfoodie.server.favor.Favor;
import net.chatfoodie.server.food.Food;
import net.chatfoodie.server.user.User;

import java.util.List;


public class FavorRequest {
    public record SaveUserFoodPreferenceDto(List<Long> foodIds) {

    }
}
