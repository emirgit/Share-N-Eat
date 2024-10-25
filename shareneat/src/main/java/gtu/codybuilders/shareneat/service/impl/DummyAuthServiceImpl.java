package gtu.codybuilders.shareneat.service.impl;


import gtu.codybuilders.shareneat.model.User;
import org.springframework.transaction.annotation.Transactional;

public class DummyAuthServiceImpl {

    //TODO: A dummy service.    
    @Transactional(readOnly = true)
    public User getCurrentUser() {
        return new User();
    }
}
