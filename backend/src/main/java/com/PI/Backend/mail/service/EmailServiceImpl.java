package com.PI.Backend.mail.service;

import com.PI.Backend.exception.MailSenderException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Log4j2
@EnableAsync
public class EmailServiceImpl implements EmailService {

	private final JavaMailSender emailSender;

	@Value("${spring.mail.username}")
	private  String fromEmail;

	@Override
	public String sendVerificationMail(MultipartFile[] file, String to, String[] cc, String subject, String body) {
		log.info("Begin sendMail");

		try {
			MimeMessage message = emailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true);
			helper.setTo(to);
			helper.setCc(cc);
			helper.setText(body, true);
			helper.setSubject(subject);
			helper.setFrom(fromEmail);

			for (int i = 0; i < file.length; i++) {
				helper.addAttachment(
						file[i].getOriginalFilename(),
						new ByteArrayResource(file[i].getBytes())
				);
			}

			emailSender.send(message);
			return "Mail send";

		} catch (Exception e) {
			log.error(e.getMessage(), e);
			throw new MailSenderException("Email not sent");
		}
	}


}
