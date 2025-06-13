package com.chaching.backend.controller;

import com.chaching.backend.model.Budget;
import com.chaching.backend.service.BudgetService;
import com.chaching.backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @GetMapping
    public List<Budget> getBudgets(@AuthenticationPrincipal CustomUserDetails user) {
        return budgetService.getBudgetsByUser(user.getId());
    }

    @PostMapping
    public Budget addBudget(@AuthenticationPrincipal CustomUserDetails user,
                            @RequestBody Budget budget) {
        return budgetService.addBudget(user.getId(), budget);
    }
}
