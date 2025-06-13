package com.chaching.backend.service;

import com.chaching.backend.model.Transaction;
import com.chaching.backend.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public List<Transaction> getTransactionsByUser(Long userId) {
        return transactionRepository.findByUserId(userId);
    }

    public Transaction createTransaction(Long userId, Transaction transaction) {
        transaction.setUserId(userId);
        return transactionRepository.save(transaction);
    }
}
