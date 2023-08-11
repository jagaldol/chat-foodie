package net.chatfoodie.server.chatroom.message.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server._core.errors.exception.Exception403;
import net.chatfoodie.server._core.errors.exception.Exception404;
import net.chatfoodie.server.chatroom.Chatroom;
import net.chatfoodie.server.chatroom.message.Message;
import net.chatfoodie.server.chatroom.message.dto.MessageResponse;
import net.chatfoodie.server.chatroom.message.repository.MessageRepository;
import net.chatfoodie.server.chatroom.repository.ChatroomRepository;
import net.chatfoodie.server._core.utils.cursor.CursorRequest;
import net.chatfoodie.server._core.utils.cursor.PageCursor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;


@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class MessageService {

    final private MessageRepository messageRepository;
    final private ChatroomRepository chatroomRepository;

    public PageCursor<MessageResponse.ContentList> chatHistory(Long userId, Long chatroomId, CursorRequest cursorRequest) {

        Chatroom chatroom = chatroomRepository.findById(chatroomId)
                .orElseThrow(() -> new Exception404("채팅방을 찾을 수 없습니다."));

        // 채팅방의 유저와 현재 접속한 유저가 같은지 확인합니다.
        if (!Objects.equals(chatroom.getUser().getId(), userId)) {
            throw new Exception403("현재 유저의 채팅방이 아닙니다.");
        }

        var messages = getMessages(chatroomId, cursorRequest);

        var nextKey = messages.stream()
                .mapToLong(Message::getId)
                .min().orElse(CursorRequest.NONE_KEY);

        var response = MessageResponse.ContentList.of(messages);
        return new PageCursor<>(cursorRequest.next(nextKey), response);
    }

    private List<Message> getMessages(Long chatroomId, CursorRequest cursorRequest) {
        Pageable pageable = PageRequest.of(0, cursorRequest.getSize());

        if (cursorRequest.hasKey())
            return messageRepository.findAllByChatroomIdAndIdLessThanOrderByIdDesc(chatroomId, cursorRequest.key(), pageable);
        return messageRepository.findAllByChatroomIdOrderByIdDesc(chatroomId, pageable);
    }
}
