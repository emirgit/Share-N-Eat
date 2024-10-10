package gtu.codybuilders.shareneat.controller;

import gtu.codybuilders.shareneat.dto.RateDto;
import gtu.codybuilders.shareneat.service.impl.RateServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rates")
@AllArgsConstructor
public class RateController {

    private final RateServiceImpl rateService;

    @PostMapping
    public ResponseEntity<Void> rate(@RequestBody RateDto rateDto) {
        rateService.rate(rateDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
