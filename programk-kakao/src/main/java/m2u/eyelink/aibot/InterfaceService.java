package m2u.eyelink.aibot;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.Charset;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import m2u.eyelink.aibot.custom.kt.config.Config;
import m2u.eyelink.aibot.domain.MessageIn;

@Service
public class InterfaceService {

	private final Logger logger = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private Config config;

	public String getResponse(MessageIn messageIn) {

		StringBuffer sb = null;
		try {

			URL url = new URL(config.getApiUrl());

			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Accept", "application/json");
			conn.setRequestProperty("Content-Type", "application/json;charset=" + IConstants.Charset.DFLT_CHARSET);

			// Send post request
			conn.setDoOutput(true);
			DataOutputStream wr = new DataOutputStream(conn.getOutputStream());

			String jsonMsg = generateProgramkRequest(messageIn);
			logger.debug("Sending message to ProgramK api. msg: {}", jsonMsg);
			wr.write(jsonMsg.getBytes(Charset.defaultCharset()));
			wr.flush();
			wr.close();

			if (conn.getResponseCode() != 200) {
				throw new RuntimeException("Failed : HTTP error code : " + conn.getResponseCode());
			}

			BufferedReader br = new BufferedReader(new InputStreamReader((conn.getInputStream())));

			String output;

			sb = new StringBuffer();
			while ((output = br.readLine()) != null) {
				sb.append(output);
			}
			conn.disconnect();

		} catch (MalformedURLException e) {
			e.printStackTrace();
			logger.error(e.getMessage());
		} catch (IOException e) {
			e.printStackTrace();
			logger.error(e.getMessage());
		}
		return sb.toString();
	}

	private String generateProgramkRequest(MessageIn messageIn) {
		
		JSONObject o = new JSONObject();
		o.put("token", config.getToken());
		o.put("user", messageIn.getUser_key());
		o.put("chat", messageIn.getContent());
		return o.toString();
	}
}
