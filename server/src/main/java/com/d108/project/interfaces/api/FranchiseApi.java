package com.d108.project.interfaces.api;

import com.d108.project.domain.franchise.dto.FranchiseDto;
import com.d108.project.domain.franchise.dto.FranchiseFeeDto;
import com.d108.project.domain.franchise.dto.FranchiseTypeDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@RequestMapping("/api/franchises")
public interface FranchiseApi {

    @GetMapping("/type")
    ResponseEntity<List<FranchiseTypeDto>> getFranchiseType();

    @GetMapping
    ResponseEntity<List<FranchiseDto>> getAllFranchises();

    @GetMapping("/name")
    ResponseEntity<List<FranchiseDto>> getAllFranchisesByName(@RequestParam String name);

    @GetMapping("/type/{type}")
    ResponseEntity<List<FranchiseDto>> getFranchisesByType(@PathVariable String type);

    @GetMapping("/fee/{franchiseId}")
    ResponseEntity<FranchiseFeeDto> getFranchiseFee(@PathVariable Long franchiseId);


}