package com.PI.Backend.entity.Products;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;

public class PolicyLoader {
    public static String loadGeneralPolicy() {
        try {
            Resource resource = new ClassPathResource("general_policy.txt");
            byte[] contenidoBytes = FileCopyUtils.copyToByteArray(resource.getInputStream());
            return new String(contenidoBytes);
        } catch (IOException e) {
            // Manejar la excepción de lectura del archivo
            return null;
        }
    }
}
