package gtu.codybuilders.shareneat;

import jakarta.annotation.PostConstruct;
import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Locale;

@SpringBootApplication
public class ShareneatApplication {

	@PostConstruct
	public void setDefaultLocale() {
		Locale.setDefault(Locale.ENGLISH);
	}

	public static void main(String[] args) {
		SpringApplication.run(ShareneatApplication.class, args);
	}

	@Bean
	public ModelMapper getModelMapper(){
		return new ModelMapper();
	}

}
