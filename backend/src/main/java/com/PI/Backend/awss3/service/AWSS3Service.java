package com.PI.Backend.awss3.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;

public interface  AWSS3Service {
    String uploadFile(MultipartFile file);

    List<String> getObjectsOfS3();

    InputStream downloadFile(String key);
}
