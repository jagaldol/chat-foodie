package net.chatfoodie.server.chat.service;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.chatfoodie.server._core.errors.exception.Exception400;
import net.chatfoodie.server._core.errors.exception.Exception403;
import net.chatfoodie.server._core.errors.exception.Exception404;
import net.chatfoodie.server._core.errors.exception.Exception500;
import net.chatfoodie.server._core.security.JwtProvider;
import net.chatfoodie.server.chat.dto.ChatFoodieRequest;
import net.chatfoodie.server.chat.dto.ChatUserRequest;
import net.chatfoodie.server.chat.dto.ChatUserResponse;
import net.chatfoodie.server.chat.dto.MessageIds;
import net.chatfoodie.server.chat.publiclog.ChatPublicLog;
import net.chatfoodie.server.chat.publiclog.repository.ChatPublicLogRepository;
import net.chatfoodie.server.chatroom.Chatroom;
import net.chatfoodie.server.chatroom.message.Message;
import net.chatfoodie.server.chatroom.message.repository.MessageRepository;
import net.chatfoodie.server.chatroom.repository.ChatroomRepository;
import net.chatfoodie.server.favor.Favor;
import net.chatfoodie.server.favor.repository.FavorRepository;
import net.chatfoodie.server.food.Food;
import net.chatfoodie.server.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserWebSocketService {

    @Value("${chatbot.url}")
    private String serverUri;

    private  final ObjectMapper om;

    private final UserRepository userRepository;

    private final MessageRepository messageRepository;

    private final ChatroomRepository chatroomRepository;

    private final ChatPublicLogRepository chatPublicLogRepository;

    private final FavorRepository favorRepository;

    public void requestToFoodie(ChatFoodieRequest.MessageDto foodieMessageDto, WebSocketSession user, Long chatroomId) throws IOException {
        // 메시지를 보내고 응답을 받습니다.
        var chatroom = chatroomRepository.findById(chatroomId).orElseThrow();

        sendMessageToFoodie(foodieMessageDto, user, foodieMessageDto.regenerate() ?
            message -> {
                Message oldMessage = messageRepository.findTop1ByChatroomIdOrderByIdDesc(chatroomId).orElse(null);
                if (oldMessage != null && oldMessage.isFromChatbot()) {
                    oldMessage.updateContent(message);
                    var chatbotMessageId = messageRepository.save(oldMessage).getId();
                    return new MessageIds(null, chatbotMessageId);
                }
                Message chatbotMessage = Message.builder()
                        .chatroom(chatroom)
                        .isFromChatbot(true)
                        .content(message)
                        .build();
                var chatbotMessageId = messageRepository.save(chatbotMessage).getId();
                return new MessageIds(null, chatbotMessageId);
            } : message -> {
            var userMessage = Message.builder()
                    .chatroom(chatroom)
                    .isFromChatbot(false)
                    .content(foodieMessageDto.user_input())
                    .build();

            var userMessageId = messageRepository.save(userMessage).getId();

            Message chatbotMessage = Message.builder()
                    .chatroom(chatroom)
                    .isFromChatbot(true)
                    .content(message)
                    .build();

            var chatbotMessageId = messageRepository.save(chatbotMessage).getId();
            return new MessageIds(userMessageId, chatbotMessageId);
            }
        );
    }

    public void requestToFoodiePublic(ChatFoodieRequest.MessageDto foodieMessageDto, WebSocketSession user, String requestMessage) throws IOException {
        // 메시지를 보내고 응답을 받습니다.
        var ip = getClientIp(user);

        Long todayRequestNum = chatPublicLogRepository.countByIpAndCreatedAtBetween(ip, LocalDate.now().atStartOfDay(), LocalDateTime.now());
        if (todayRequestNum >= 20 ) {
            log.info(ip + ": 일일 최대 횟수에 도달했습니다.");
            throw new Exception400("일일 최대 횟수에 도달했습니다.");
        }
        sendMessageToFoodie(foodieMessageDto, user, (message) -> {
            ChatPublicLog chatLog = ChatPublicLog.builder()
                    .ip(getClientIp(user))
                    .requestMessage(requestMessage)
                    .output(message)
                    .build();
            chatPublicLogRepository.save(chatLog);
            log.debug("public api 마지막 전달 완료!!\n" + message);
            return new MessageIds(null, null);
        });
    }

    public Long getUserId(WebSocketSession session) throws IOException {
        String token = extractTokenFromSession(session);
        DecodedJWT decodedJWT = JwtProvider.verify(token);
        return decodedJWT.getClaim("id").asLong();
    }

    @Transactional
    public ChatFoodieRequest.MessageDto makeFoodieRequestDto(ChatUserRequest.MessageDto userMessageDto, Long userId) {

        Chatroom chatroom = chatroomRepository.findByIdJoinUser(userMessageDto.chatroomId())
                .orElseThrow(() -> new Exception404("존재하지 않는 채팅방입니다."));

        if (!Objects.equals(userId, chatroom.getUser().getId()))
            throw new Exception403("권한이 없는 채팅방입니다.");

        var messages = messageRepository.findTop38ByChatroomIdOrderByIdDesc(userMessageDto.chatroomId());

        List<List<String>> history = makeHistoryFromMessages(messages);
        var favorString = makeFavorString(userId);
        var processedUserInput = new StringBuilder(userMessageDto.input());

        if (userMessageDto.regenerate()) {
            if (!history.isEmpty()) {
                var originalMessageList = new ArrayList<>(history.get(history.size() - 1));

                originalMessageList.set(0, favorString + originalMessageList.get(0));
                history.set(history.size() - 1, originalMessageList);
            }
        } else {
            processedUserInput.insert(0, favorString);
        }
        return new ChatFoodieRequest.MessageDto(processedUserInput.toString(), userMessageDto.regenerate(), history, chatroom.getUser().getName());
    }

    private String getClientIp(WebSocketSession session) {
        HttpHeaders headers = session.getHandshakeHeaders();
        String realIp = headers.getFirst("X-Real-IP");

        if (realIp != null && !realIp.isEmpty()) {
            return realIp;
        } else {
            return Objects.requireNonNull(session.getRemoteAddress()).getAddress().getHostAddress();
        }
    }

    private void sendMessageToFoodie(ChatFoodieRequest.MessageDto foodieMessageDto, WebSocketSession user, MyFunction function) throws IOException {
        String messageToSend = om.writeValueAsString(foodieMessageDto);

        FoodieWebSocketService foodieWebSocketService = new FoodieWebSocketService(serverUri);
        try {
            foodieWebSocketService.sendMessage(messageToSend);
        } catch (Exception e) {
            throw new Exception500("챗봇으로 메시지 전송 중 오류가 발생했습니다.");
        }
        foodieWebSocketService.listenForMessages(user, function);
    }

    private String makeFavorString(Long userId) {
        var favors = favorRepository.findByUserId(userId);

        var favorFoodNames = favors.stream()
                .map(favor -> favor.getFood().getName())
                .toList();

        StringBuilder result = new StringBuilder("나는 ");

        List<String> randomFoods = new ArrayList<>();

        if (favors.size() > 5) {
            List<String> shuffledFoods = new ArrayList<>(favorFoodNames);
            Collections.shuffle(shuffledFoods);
            randomFoods = shuffledFoods.subList(0, 5);
        } else {
            randomFoods = favorFoodNames;
        }
        for (var food : randomFoods) {
            result.append(food).append(",");
        }
        result.deleteCharAt(result.length() - 1);
        result.append("를 좋아해 이를 바탕으로 음식을 추천해줘.\n");
        return result.toString();
    }

    private List<String> makeFavorMessages(Long userId) {
        var favors = favorRepository.findByUserId(userId);
        List<String> favorMessages = new ArrayList<>();

        if (!favors.isEmpty()){

            Random random = new Random();
            int randomFoodIndex = random.nextInt(favors.size());
            Food randomFood = favors.get(randomFoodIndex).getFood();
            String randomFoodName = randomFood.getName();

            // 각 요소의 빈도를 카운트하기 위한 맵들
            Map<String, Integer> flavorCounts = new HashMap<>();
            Map<String, Integer> countryCounts = new HashMap<>();
            Map<String, Integer> temperatureCounts = new HashMap<>();
            Map<String, Integer> mainIngredientCounts = new HashMap<>();
            Map<String, Integer> spicyCounts = new HashMap<>();
            Map<String, Integer> oilyCounts = new HashMap<>();

            for (Favor favor : favors) {
                Food food = favor.getFood();
                var foodFlavor = food.getFlavor();
                var foodCountry = food.getCountry();
                var foodTemperature = food.getTemperature();
                var foodMainIngredient = food.getIngredient();
                var foodSpicy = toSpicyString(food.getSpicy());
                var foodOily = food.getOily();

                // 각 요소의 빈도를 카운트
                flavorCounts.put(foodFlavor, flavorCounts.getOrDefault(foodFlavor, 0) + 1);
                countryCounts.put(foodCountry, countryCounts.getOrDefault(foodCountry, 0) + 1);
                temperatureCounts.put(foodTemperature, temperatureCounts.getOrDefault(foodTemperature, 0) + 1);
                mainIngredientCounts.put(foodMainIngredient, mainIngredientCounts.getOrDefault(foodMainIngredient, 0) + 1);
                spicyCounts.put(foodSpicy, spicyCounts.getOrDefault(foodSpicy, 0) + 1);
                oilyCounts.put(foodOily, oilyCounts.getOrDefault(foodOily, 0) + 1);
            }

            // 가장 많이 선택된 요소들 찾기
            String mostPreferredFlavor = findMostPreferredElement(flavorCounts);
            String mostPreferredCountry = findMostPreferredElement(countryCounts);
            String mostPreferredTemperature = findMostPreferredElement(temperatureCounts);
            String mostPreferredMainIngredient = findMostPreferredElement(mainIngredientCounts);
            String mostPreferredSpicy = findMostPreferredElement(spicyCounts);
            String mostPreferredOily = findMostPreferredElement(oilyCounts);

            var userMessage = "내가 가장 좋아하는 맛은 '" + mostPreferredFlavor + "' 맛이며, " +
                    "선호하는 음식의 국가는 '" + mostPreferredCountry + "'이고, " +
                    "선호하는 온도는 '" + mostPreferredTemperature + "'이며, " +
                    "주요한 재료로 '" + mostPreferredMainIngredient + "'을(를) 선호하며, " +
                    "선호하는 맵기는 '" + mostPreferredSpicy + "' 정도이고, '" +
                    mostPreferredOily + "' 을 가진 음식을 좋아해. " +
                    "예를 들면 '" + randomFoodName + "'를 좋아해 " +
                    "앞으로의 대화에 내 선호도를 기반으로 대답해줘!";
            var foodieMessage = "알겠습니다 선호도를 기억했습니다! 앞으로의 대답은 기억한 선호도를 기반으로 대답해 드리겠습니다.";
            favorMessages.add(userMessage);
            favorMessages.add(foodieMessage);
            log.info(userMessage);
        }
        return favorMessages;
    }

    // 가장 많이 선택된 요소 찾기
    private String findMostPreferredElement(Map<String, Integer> elementCounts) {
        String mostPreferredElement = "";
        int maxCount = 0;

        for (Map.Entry<String, Integer> entry : elementCounts.entrySet()) {
            if (entry.getValue() > maxCount) {
                maxCount = entry.getValue();
                mostPreferredElement = entry.getKey();
            }
        }

        return mostPreferredElement;
    }

    // toSpicyString 메서드 정의 (매운 정도를 텍스트로 변환)

    private String toSpicyString(int spicy) {
        return switch (spicy) {
            case 1 -> "덜 매움";
            case 2 -> "매움";
            case 3 -> "많이 매움";
            default -> "안 매움";
        };
    }

    private List<List<String>> makeHistoryFromMessages(List<Message> messages) {
        List<String> reversedMessages = new ArrayList<>();

        for (Message message : messages) {

            var isChatbotTurn = reversedMessages.size() % 2 == 0;

            if (isChatbotTurn && !message.isFromChatbot()) {
               reversedMessages.add("");
            }
            if (!isChatbotTurn && message.isFromChatbot()) {
                reversedMessages.add("");
            }

            reversedMessages.add(message.getContent());

            if (reversedMessages.size() >= 38)
                break;
        }
        if (reversedMessages.size() % 2 == 1)
            reversedMessages.remove(reversedMessages.size() - 1);

        List<List<String>> history = new ArrayList<>();

        for(int i = reversedMessages.size() - 1; i >= 0; i -= 2) {
            history.add(List.of(reversedMessages.get(i), reversedMessages.get(i - 1)));
        }

        return history;
    }

    public TextMessage createErrorMessage(String message) {
        var errorResponse = new ChatUserResponse.MessageDto("error", message);
        try {
            return new TextMessage(om.writeValueAsString(errorResponse));
        } catch (JsonProcessingException e) {
            log.error("ErrorMessage를 만드는 중 오류 발생했습니다.:" + message);
            return new TextMessage("{\"event\":\"error\",\"response\":\"서버 에러입니다.\"}");
        }
    }

    public String extractTokenFromSession(WebSocketSession session) throws IOException {
        String queryString = Objects.requireNonNull(session.getUri()).getQuery();

        if (queryString == null) {
            log.info(session + "클라이언트의 토큰이 존재 하지 않음");
            throw new RuntimeException();
        }
        String tokenParam = "token=";
        int tokenParamIndex = queryString.indexOf(tokenParam);
        if (tokenParamIndex == -1) {
            throw new RuntimeException();
        }
        int tokenValueStartIndex = tokenParamIndex + tokenParam.length();
        int tokenValueSplitIndex = queryString.indexOf('&', tokenValueStartIndex);
        int tokenValueEndIndex = tokenValueSplitIndex == -1 ? queryString.length() : tokenValueSplitIndex;
        return queryString.substring(tokenValueStartIndex, tokenValueEndIndex);
    }
}
