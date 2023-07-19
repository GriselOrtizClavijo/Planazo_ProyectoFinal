package com.PI.Backend.mail.service;

import org.springframework.web.multipart.MultipartFile;

public interface EmailService {

    public String sendVerificationMail(MultipartFile[] file, String to, String[] cc, String subject, String body);

}