package com.tripbee.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class TripbeeBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(TripbeeBackendApplication.class, args);
	}

}
