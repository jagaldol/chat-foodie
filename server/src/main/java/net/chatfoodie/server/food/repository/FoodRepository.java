package net.chatfoodie.server.food.repository;

import net.chatfoodie.server.food.Food;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodRepository extends JpaRepository<Food, Long> {
}
