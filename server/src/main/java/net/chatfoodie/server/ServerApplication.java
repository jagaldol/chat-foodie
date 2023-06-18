package net.chatfoodie.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.yaml.snakeyaml.DumperOptions;
import org.yaml.snakeyaml.Yaml;

import java.io.*;
import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
public class ServerApplication {

    final static private String RESOURCE_PATH = "src/main/resources/";

    final static private String CONFIG_FILE = "application-settings.yml";

    public static void main(String[] args) {
        if (!isExistApplicationSettings())
            return;

        SpringApplication.run(ServerApplication.class, args);
    }

    private static Boolean isExistApplicationSettings() {
        var applicationSettings = new File(RESOURCE_PATH + CONFIG_FILE);
        if (applicationSettings.exists()) {
            return true;
        }
        System.out.println("application-settings.yml 파일을 생성합니다.");
        createYamlFile(applicationSettings);
        System.out.println("application-settings.yml 를 수정하고 다시 실행해 주세요.");
        return false;

    }

    private static void createYamlFile(File settingsFile) {
        FileWriter writer = null;
        try {
            writer = new FileWriter(settingsFile);

            Map<String, Object> dataSource = new HashMap<>();
            dataSource.put("url", "jdbc:mysql://localhost:3306/chatfoodie_db?rewriteBatchedStatements=true&characterEncoding=UTF-8&serverTimezone=Asia/Seoul");
            dataSource.put("username", "${your username}");
            dataSource.put("password", "${your password}");

            Map<String, Object> spring = new HashMap<>();
            spring.put("datasource", dataSource);

            Map<String, Object> result = new HashMap<>();
            result.put("spring", spring);

            DumperOptions options = new DumperOptions();
            options.setDefaultFlowStyle(DumperOptions.FlowStyle.BLOCK);

            Yaml yaml = new Yaml(options);
            yaml.dump(result, writer);

        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            if (writer != null) {
                try {
                    writer.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
