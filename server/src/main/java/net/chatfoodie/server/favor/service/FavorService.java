package net.chatfoodie.server.favor.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import net.chatfoodie.server._core.errors.exception.Exception400;
import net.chatfoodie.server._core.errors.exception.Exception404;
import net.chatfoodie.server._core.security.CustomUserDetails;
import net.chatfoodie.server.favor.Favor;
import net.chatfoodie.server.favor.dto.FavorRequest;
import net.chatfoodie.server.favor.repository.FavorRepository;
import net.chatfoodie.server.food.Food;
import net.chatfoodie.server.food.repository.FoodRepository;
import net.chatfoodie.server.user.User;
import net.chatfoodie.server.user.repository.UserRepository;
import net.chatfoodie.server.user.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class FavorService {

    final private FavorRepository favorRepository;
    final private FoodRepository foodRepository;
    final private UserRepository userRepository;



    @Transactional
    public void saveUserFoodPreference(Long id, FavorRequest.SaveUserFoodPreferenceDto requestDto)  {
        List<Long> foodIds = requestDto.foodIds();
        User user = userRepository.findById(id).orElseThrow(()-> new Exception404("해당 회원이 존재하지 않습니다"));

        favorRepository.deleteAllByUserId(id);

        List<Food> foods = foodRepository.findByIdIn(foodIds);
        if (foodIds.size() != foods.size()) throw new Exception400("해당 음식이 존재하지 않습니다.");
        List<Favor> favors = foods.stream()
                .map(food -> Favor.builder()
                        .user(user)
                        .food(food)
                        .created_at(LocalDateTime.now())
                        .build())
                .collect(Collectors.toList());

        favorRepository.saveAll(favors);
                log.info("사용자의 선호 음식 정보가 저장되었습니다. 사용자 ID: {}, 음식 ID: {}", id, foodIds);
            }

}






