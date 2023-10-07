package net.chatfoodie.server.chat.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server._core.errors.exception.Exception500;
import net.chatfoodie.server._core.utils.MyFunction;
import net.chatfoodie.server.chat.dto.ChatFoodieResponse;
import net.chatfoodie.server.chat.dto.ChatUserResponse;
import net.chatfoodie.server.chat.handler.FoodieWebSocketHandler;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.client.WebSocketClient;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;

import java.io.IOException;
import java.util.Objects;
import java.util.concurrent.*;


@Slf4j
public class FoodieWebSocketService {

    final private WebSocketClient webSocketClient = new StandardWebSocketClient();

    final private String serverUri;

    final private FoodieWebSocketHandler foodieWebSocketHandler = new FoodieWebSocketHandler();

    final private ExecutorService executorService = Executors.newSingleThreadExecutor();

    final private ObjectMapper om = new ObjectMapper();

    public FoodieWebSocketService(String serverUri) {
        this.serverUri = serverUri;
    }


    public void sendMessage(String message) throws Exception {
        // 서버로 메시지 전송
        WebSocketSession session = webSocketClient.execute(foodieWebSocketHandler, serverUri).get();
        log.info("챗봇으로의 보낼 메시지:" + message);
        session.sendMessage(new TextMessage(message));
    }

    public void listenForMessages(WebSocketSession user, MyFunction function) {

        Future<?> future = executorService.submit(() -> {
            String finalResponse = "";
            try {
                while (!Thread.currentThread().isInterrupted()) {
                    try {
                        ChatFoodieResponse.MessageDto foodieMessageDto = foodieWebSocketHandler.receiveMessage(); // 메시지를 받음 (메시지가 없으면 대기)

                        var userMessageDto = new ChatUserResponse.MessageDto(foodieMessageDto);

                        TextMessage textMessage = new TextMessage(om.writeValueAsString(userMessageDto));

                        user.sendMessage(textMessage);

                        if (isStreamEndEvent(foodieMessageDto)) {
                            function.apply(finalResponse);
                            break;
                        }
                        finalResponse = userMessageDto.response();
                    } catch (InterruptedException e) {
                        throw new Exception500("챗봇의 응답을 듣는 중 에러가 발생했습니다.");
                    } catch (JsonProcessingException e) {
                        throw new Exception500("챗봇의 응답을 분석하는 중 에러가 발생했습니다.");
                    } catch (IOException e) {
                        throw new Exception500("챗봇의 답변 전달 중 오류가 발생했습니다.");
                    }
                }
            } catch (Exception500 e) {
                throw new Exception500(e.getMessage());
            } finally {
                log.debug("쓰레드 종료됨");
            }
        });

        try {
            // 10분 후에 쓰레드 종료
            future.get(10, TimeUnit.MINUTES);
        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            log.error("챗봇과의 연결이 10분이 초과되어 강제로 종료합니다.");
            future.cancel(true); // 예외 발생 시 쓰레드 강제 종료
            throw new Exception500("챗봇과의 연결이 10분이 초과되어 강제로 종료합니다.");
        } catch (Exception500 e) {
            throw new Exception500(e.getMessage());
        } finally {
            executorService.shutdown();
        }
    }

    public static boolean isStreamEndEvent(ChatFoodieResponse.MessageDto messageDto) {
        return Objects.equals(messageDto.event(), "stream_end");
    }
}