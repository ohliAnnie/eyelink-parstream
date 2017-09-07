package m2u.eyelink.aibot.custom.kt.config;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import m2u.eyelink.aibot.InterfaceController;
import m2u.eyelink.aibot.IConstants;

@Component
public class Config {

	private static final Logger logger = LoggerFactory.getLogger(InterfaceController.class);

	private final Map<String, String> configs = new HashMap<>();
	private boolean isSet = false;
	
	public Map<String, String> getConfigs(){
		return this.configs;
	}
	public String getApiUrl() {
		return (String)this.configs.get(IConstants.Configs.API_URL);
	}
	public String getToken() {
		return (String)this.configs.get(IConstants.Configs.TOKEN);
	}
	
	@PostConstruct
	private void init() throws IOException, InterruptedException {
		
		String configFilePath = System.getProperty(IConstants.Configs.CONFIG);
		
		if ( configFilePath == null ) {
			throw new RuntimeException("JVM option is required.  -Difconfig={config file path}") ;
		}
		
		while(!isSet) {
			try (InputStream configStream = new FileInputStream(new File(configFilePath))) {
				
				Properties props = new Properties();
				props.load(configStream);
				
				logger.info("Setting initial properties......");
				for (Object key : props.keySet() ) {
					configs.put((String)key, (String)props.get(key));
				}
				isSet = true;
			}catch (Exception e) {
				logger.error("{}", e.getMessage());
				Thread.sleep(10000);
			}
		}
	}
	
}