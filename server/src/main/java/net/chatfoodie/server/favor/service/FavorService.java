package net.chatfoodie.server.favor.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import net.chatfoodie.server.favor.Favor;
import net.chatfoodie.server.favor.dto.FavorRequest;
import net.chatfoodie.server.favor.repository.FavorRepository;
import net.chatfoodie.server.food.Food;
import net.chatfoodie.server.food.repository.FoodRepository;
import net.chatfoodie.server.user.User;
import net.chatfoodie.server.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;


@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class FavorService {

    final private FavorRepository favorRepository;
    final private FoodRepository foodRepository;
    final private UserRepository userRepository;

    @Transactional
    public void saveUserFoodPreference(FavorRequest.SaveUserFoodPreferenceDto requestDto) {
        List<Long> favorIds = requestDto.favorIds();
        Long userId = requestDto.userId();
        User user = userRepository.findById(userId).orElse(null);

//        List<Favor> existingFavors = favorRepository.findByUserId(user.getId());
//        favorRepository.deleteAll(existingFavors);

        favorRepository.deleteAllByUser(user);

        favorRepository.resetIdSequence();
        for (Long foodId : favorIds) {
            // 음식 ID로 음식을 가져옵니다.
            Food food = foodRepository.findById(foodId).orElse(null);
            // 사용자 ID로 사용자를 가져옵니다.
            if (food != null && user != null) {
                // 사용자의 선호 음식 정보를 저장하는 Favor 객체 생성
                Favor favor = Favor.builder()
                        .user(user)
                        .food(food)
                        .created_at(LocalDateTime.now())
                        .build();
                // Favor 객체를 데이터베이스에 저장합니다.
                favorRepository.save(favor);

                // 사용자의 선호 음식 정보가 성공적으로 저장되었음을 로그로 출력합니다.
                log.info("사용자의 선호 음식 정보가 저장되었습니다. 사용자 ID: {}, 음식 ID: {}", userId, foodId);
            }
        }
    }
}




