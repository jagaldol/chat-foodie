package net.chatfoodie.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.*;
import java.util.Properties;

@SpringBootApplication
public class ServerApplication {

    final static private String RESOURCE_PATH = "src/main/resources/";

    final static private String CONFIG_FILE = "application-settings.properties";

    public static void main(String[] args) {
        if (!confirmSettingProperties())
            return;

        SpringApplication.run(ServerApplication.class, args);
    }

    private static Boolean confirmSettingProperties() {
        var settingProperties = new File(RESOURCE_PATH + CONFIG_FILE);
        if (settingProperties.exists()) {
            return true;
        }
        System.out.println("application-settings.properties 파일을 생성합니다.");
        createSettingProperties(settingProperties);
        System.out.println("application-setting.properties 를 수정하고 다시 실행해 주세요.");
        return false;

    }

    private static void createSettingProperties(File propertiesFile) {
        Properties prop = new Properties();
        OutputStream output = null;

        try {
            output = new FileOutputStream(propertiesFile);

            prop.setProperty("spring.datasource.url", "jdbc:mysql://localhost:3306/chatfoodie?jdbc:mysql://localhost:3306/chatfoodie?rewriteBatchedStatements=true&characterEncoding=UTF-8&serverTimezone=Asia/Seoul");
            prop.setProperty("spring.datasource.username", "${your username}");
            prop.setProperty("spring.datasource.password", "${your password}");

            // save properties to project root folder
            prop.store(output, null);

        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            if (output != null) {
                try {
                    output.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

        }
    }
}
