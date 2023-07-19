package com.PI.Backend.awss3.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AWSS3ServiceImpl implements AWSS3Service {
    @Autowired
    private AmazonS3 amazonS3;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    //Subir la imagen y obtener la url desde el bucket
    @Override
    public String uploadFile(MultipartFile file) {
        String url = "";
        String newFileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        try {
            PutObjectRequest request = new PutObjectRequest(bucketName, newFileName, file.getInputStream(), new ObjectMetadata());
            amazonS3.putObject(request);
            url = amazonS3.getUrl(bucketName, newFileName).toString();
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error al cargar el archivo", e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno del servidor", e);
        }
        return url;
    }

    @Override
    public List<String> getObjectsOfS3() {
        ListObjectsV2Result result = amazonS3.listObjectsV2(bucketName);
        List<S3ObjectSummary> objects = result.getObjectSummaries();
        List<String> list = objects.stream().map(item -> {
            return  item.getKey();
        }).collect(Collectors.toList());
        return list;
    }

    @Override
    public InputStream downloadFile(String key) {
        S3Object object = amazonS3.getObject(bucketName, key);
        return object.getObjectContent();
    }
}

