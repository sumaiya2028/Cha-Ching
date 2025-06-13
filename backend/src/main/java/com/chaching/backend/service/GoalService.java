package com.chaching.backend.service;

import com.chaching.backend.model.Goal;
import com.chaching.backend.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;

    public List<Goal> getGoalsByUser(Long userId) {
        return goalRepository.findByUserId(userId);
    }

    public Goal contributeToGoal(Long userId, Long goalId, Double amount) {
        Optional<Goal> optionalGoal = goalRepository.findById(goalId);

        if (optionalGoal.isEmpty()) {
            throw new RuntimeException("Goal not found");
        }

        Goal goal = optionalGoal.get();

        if (!goal.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        goal.setCurrentAmount(goal.getCurrentAmount() + amount);

        return goalRepository.save(goal);
    }
}
