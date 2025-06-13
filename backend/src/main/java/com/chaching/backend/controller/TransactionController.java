package com.chaching.backend.controller;

import com.chaching.backend.model.Transaction;
import com.chaching.backend.service.TransactionService;
import com.chaching.backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public List<Transaction> getAllTransactions(@AuthenticationPrincipal CustomUserDetails user) {
        return transactionService.getTransactionsByUser(user.getId());
    }

    @PostMapping
    public Transaction createTransaction(@AuthenticationPrincipal CustomUserDetails user,
                                         @RequestBody Transaction transaction) {
        return transactionService.createTransaction(user.getId(), transaction);
    }
}
