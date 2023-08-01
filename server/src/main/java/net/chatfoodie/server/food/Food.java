package net.chatfoodie.server.food;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDateTime;

@Entity
@Getter
@DynamicInsert
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "food_tb")
public class Food {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50, nullable = false)
    private String name;

    @Column(length = 100, nullable = false)
    private String imageUrl;

    @Column(length = 50, nullable = false)
    private String country;

    @Column(length = 50, nullable = false)
    private String flavor;

    @Column(length = 50, nullable = false)
    private String temperature;

    @Column(length = 50, nullable = false)
    private String ingredient;

    @Column(nullable = false)
    private int spicy;

    @Column(length = 50, nullable = false)
    private String oily;

    @ColumnDefault("now()")
    private LocalDateTime createdAt;

    @Builder
    public Food(Long id, String name, String imageUrl, String country, String flavor, String temperature, String ingredient, int spicy, String oily, LocalDateTime created_at) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.country = country;
        this.flavor = flavor;
        this.temperature = temperature;
        this.ingredient = ingredient;
        this.spicy = spicy;
        this.oily = oily;
        this.createdAt = created_at;
    }
}
