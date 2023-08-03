package net.chatfoodie.server.favor;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import net.chatfoodie.server.food.Food;
import net.chatfoodie.server.user.User;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;
import java.time.LocalDateTime;

@Entity
@Getter
@DynamicInsert
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "favor_tb")
public class Favor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    private Food food;

    @ColumnDefault("now()")
    private LocalDateTime createdAt;

    @Builder
    public Favor(Long id, User user, Food food, LocalDateTime created_at) {
        this.id = id;
        this.user = user;
        this.food = food;
        this.createdAt = created_at;
    }
}
