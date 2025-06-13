package com.chaching.backend.controller;

import com.chaching.backend.model.Goal;
import com.chaching.backend.model.ContributionRequest;
import com.chaching.backend.service.GoalService;
import com.chaching.backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @GetMapping
    public List<Goal> getGoals(@AuthenticationPrincipal CustomUserDetails user) {
        return goalService.getGoalsByUser(user.getId());
    }

    @PostMapping("/{id}/contribute")
    public Goal contribute(@AuthenticationPrincipal CustomUserDetails user,
                           @PathVariable Long id,
                           @RequestBody ContributionRequest request) {
        return goalService.contributeToGoal(user.getId(), id, request.getAmount());
    }
}
