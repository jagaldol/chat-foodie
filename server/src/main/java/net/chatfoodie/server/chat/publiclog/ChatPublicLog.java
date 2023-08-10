package net.chatfoodie.server.chat.publiclog;

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
@Table(name = "chat_public_log_tb",
        indexes = {
            @Index(name = "chat_public_log_ip_created_at_idx", columnList = "ip, createdAt")
        })
public class ChatPublicLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 20)
    private String ip;

    @Column(columnDefinition = "TEXT")
    private String requestMessage;

    @Column(columnDefinition = "TEXT")
    private String output;

    @ColumnDefault(value = "now()")
    private LocalDateTime createdAt;

    @Builder
    public ChatPublicLog(Long id, String ip, String requestMessage, String output, LocalDateTime createdAt) {
        this.id = id;
        this.ip = ip;
        this.requestMessage = requestMessage;
        this.output = output;
        this.createdAt = createdAt;
    }
}
