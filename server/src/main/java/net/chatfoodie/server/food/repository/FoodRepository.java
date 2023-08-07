package net.chatfoodie.server.food.repository;

import net.chatfoodie.server.food.Food;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodRepository extends JpaRepository<Food, Long> {
    List<Food> findByIdIn(List<Long> ids);
}
