package net.chatfoodie.server.favor.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.chatfoodie.server._core.utils.ApiUtils;
import net.chatfoodie.server.favor.dto.FavorRequest;
import net.chatfoodie.server.favor.service.FavorService;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class FavorController {

    final private FavorService favorService;

    @PostMapping("/favors")
    public ResponseEntity<?> saveUserFoodPreference(@RequestBody @Valid FavorRequest.SaveUserFoodPreferenceDto requestDto,Errors error) {
        favorService.saveUserFoodPreference(requestDto);
        ApiUtils.Response<?> response = ApiUtils.success();
        return ResponseEntity.ok().body(response);
    }
}
