package net.chatfoodie.server.food.repository;

import net.chatfoodie.server.food.Food;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FoodRepository extends JpaRepository<Food, Long> {
    Optional<Food> findById(Long id);
}
