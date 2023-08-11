package net.chatfoodie.server.chatroom.message.repository;

import net.chatfoodie.server.chatroom.message.Message;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import java.sql.ResultSet;
import java.time.LocalDateTime;
import java.util.List;

public class ScrollRepository {

    final static private RowMapper<Message> ROW_MAPPER = (ResultSet resultSet, int rowNum) -> Message.builder()
            .id(resultSet.getLong("id"))
            .chatroomId(resultSet.getLong("chatroom_id"))
            .content(resultSet.getString("content"))
            .createdAt(resultSet.getObject("created_at", LocalDateTime.class))
            .isFromChatbot(resultSet.getBoolean("is_from_chatbot"))
            .build();

        final private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

        public ScrollRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
            this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
        }


        public List<Message> findAllByChatroomId(Long chatroomId, int limit) {
            String sql = "SELECT * FROM message WHERE chatroom_id = :chatroomId ORDER BY id DESC LIMIT :limit";
            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("chatroomId", chatroomId)
                    .addValue("limit", limit);
            return namedParameterJdbcTemplate.query(sql, params, ROW_MAPPER);
        }


        public List<Message> findAllByLessThanIdAndChatroomId(Long id, Long chatroomId, int limit) {
            String sql = "SELECT * FROM message WHERE chatroom_id = :chatroomId AND id < :id ORDER BY id DESC LIMIT :limit";
            MapSqlParameterSource params = new MapSqlParameterSource()
                    .addValue("chatroomId", chatroomId)
                    .addValue("id", id)
                    .addValue("limit", limit);
            return namedParameterJdbcTemplate.query(sql, params, ROW_MAPPER);
        }
    }

}
