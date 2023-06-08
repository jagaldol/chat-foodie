package net.chatfoodie.server.controller;

import lombok.RequiredArgsConstructor;
import net.chatfoodie.server.domain.user.dto.UserDto;
import net.chatfoodie.server.domain.user.service.UserReadService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/users")
public class UserController {

    final private UserReadService userReadService;

    @GetMapping("/{id}")
    public UserDto getUser(@PathVariable Long id) {

        return userReadService.getUserById(id);
    }
}
