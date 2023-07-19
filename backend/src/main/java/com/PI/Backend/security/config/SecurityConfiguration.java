package com.PI.Backend.security.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

	private final JwtAuthenticationFilter jwtAuthFilter;
	private final AuthenticationProvider authenticationProvider;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		/*http.headers().frameOptions().disable();*/
		http
				.cors(cors -> cors.configurationSource(corsConfigurationSource()))
				.csrf(AbstractHttpConfigurer::disable)
				.authorizeHttpRequests((authorize) -> authorize
				.requestMatchers(
						HttpMethod.POST,
						"/auth/**",
						"/categories/create",
						"/categories/**",
						"/products/create",
						"/products/**",
						"/images/**",
						"/characteristic/**",
						"/booking/**",
						"/home/**",
						"/cities/**",
						"/provinces/**",
						"/reviews/**",
						"/mail/**",
						"/session/**",
						"/favs/**",
						"/swagger-resources",
						"/swagger-resources/**",
						"/swagger-ui/**",
						"/swagger-ui.html"
				)
				.permitAll())
				.authorizeHttpRequests((authorize) -> authorize
				.requestMatchers(
						HttpMethod.GET,
						"auth/**",
						"/home/**",
						"/products/**",
						"/categories/**",
						"/characteristic/**",
						"/images/**",
						"/booking/**",
						"/cities/**",
						"/provinces/**",
						"/reviews/**",
						"/mail/**",
						"/session/**",
						"/favs/**",
						"/v3/api-docs/**",
						"/swagger-resources",
						"/swagger-resources/**",
						"/swagger-ui/**",
						"/swagger-ui.html"
				)
				.permitAll())
				.authorizeHttpRequests((authorize) -> authorize
				.anyRequest()
				.authenticated())
				.sessionManagement(session -> session
				.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
				)
				.authenticationProvider(authenticationProvider)
				.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}


	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(
					List.of(
							"http://127.0.0.1:5173",
							"http://localhost:5173",
							"http://planazo-hosting.s3-website.us-east-2.amazonaws.com"
					));
		configuration.setAllowedHeaders(List.of("*"));
		configuration.setAllowedMethods(List.of("*"));
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

}