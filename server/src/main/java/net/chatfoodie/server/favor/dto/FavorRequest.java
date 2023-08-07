package net.chatfoodie.server.favor.dto;

import java.util.List;


public class FavorRequest {
    public record SaveUserFoodPreferenceDto(List<Long> foodIds) {

    }
}
