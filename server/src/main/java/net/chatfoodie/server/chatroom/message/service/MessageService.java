package net.chatfoodie.server.chatroom.message.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server.chatroom.message.Message;
import net.chatfoodie.server.chatroom.message.dto.MessageResponse;
import net.chatfoodie.server.chatroom.message.repository.MessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class MessageService {

    final private MessageRepository messageRepository;


    public MessageResponse.contentList chatHistory(Long chatroomId) {

        // 채팅방의 대화내용을 조회하고, 최신 메시지 순서로 정렬합니다.
        List<Message> chatHistory = messageRepository.findAllByChatroomIdOrderByIdDesc(chatroomId);

        return MessageResponse.contentList.of(chatHistory);
    }


}
