package com.PI.Backend.awss3.controller;


import com.PI.Backend.awss3.service.AWSS3ServiceImpl;
import com.PI.Backend.service.ProductsService.ImageService;
import com.PI.Backend.service.ProductsService.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.ion.IonException;


import java.util.*;


@RestController
@RequestMapping("/s3")
@CrossOrigin(origins = {"http://127.0.0.1:5173", "http://localhost:5173"})
public class UploadFileController {
    @Autowired
    private ImageService imgService;

    @Autowired
    private AWSS3ServiceImpl awss3Service;
    @Autowired
    private ProductService productService;

    @PostMapping(value = "/upload")
    public ResponseEntity<String> uploadFile(@RequestPart(value = "file") MultipartFile file) {
        try {
            String response = awss3Service.uploadFile(file);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getMessage(), e.getStatusCode());
        }
    }

   //No necesitamos este controller por ahora
    @GetMapping(value = "/list")
    public ResponseEntity<List<String>> listFiles() {
        return new ResponseEntity<List<String>>(awss3Service.getObjectsOfS3(), HttpStatus.OK);
    }

    //No necesitamos este controller por ahora
    @GetMapping(value = "/download")
    public ResponseEntity<Resource> download(@RequestParam("key") String key) {
        InputStreamResource resource  = new InputStreamResource(awss3Service.downloadFile(key));
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=\""+key+"\"").body(resource);

    }
}
