package com.chaching.backend.service;

import com.chaching.backend.model.Budget;
import com.chaching.backend.repository.BudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;

    public List<Budget> getBudgetsByUser(Long userId) {
        return budgetRepository.findByUserId(userId);
    }

    public Budget addBudget(Long userId, Budget budget) {
        budget.setUserId(userId);
        return budgetRepository.save(budget);
    }
}
