package net.chatfoodie.server.favor.controller;

import lombok.RequiredArgsConstructor;
import net.chatfoodie.server._core.utils.ApiUtils;
import net.chatfoodie.server.favor.dto.FavorRequest;
import net.chatfoodie.server.favor.service.FavorService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class FavorController {

    final private FavorService favorService;

    @PostMapping("/favor/saveUserFoodPreference")
    public ResponseEntity<?> saveUserFoodPreference(@RequestBody FavorRequest.SaveUserFoodPreferenceDto requestDto) {
        favorService.saveUserFoodPreference(requestDto);
        ApiUtils.Response<?> response = ApiUtils.success();
        return ResponseEntity.ok().body(response);
    }
}
