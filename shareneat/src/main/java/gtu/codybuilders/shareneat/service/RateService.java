package gtu.codybuilders.shareneat.service;

import gtu.codybuilders.shareneat.dto.RateDto;

public interface RateService {
    void rate(RateDto rateDto);
    void unrate(Long postId);
}
