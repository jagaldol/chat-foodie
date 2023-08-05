package net.chatfoodie.server.favor.dto;

import net.chatfoodie.server.favor.Favor;
import net.chatfoodie.server.food.Food;
import net.chatfoodie.server.user.User;

import java.util.List;


public class FavorRequest {
    public record SaveUserFoodPreferenceDto(Long userId, List<Long> favorIds) {
        public List<Favor> toFavors() {
            return favorIds.stream()
                    .map(favorId -> Favor.builder()
                            .user(User.builder().id(userId).build())
                            .food(Food.builder().id(favorId).build())
                            .build())
                    .toList();
        }
    }
}
