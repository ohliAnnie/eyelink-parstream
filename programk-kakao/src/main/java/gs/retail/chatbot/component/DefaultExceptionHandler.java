package gs.retail.chatbot.component;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 * 기본적인 예외 처리를 위한 핸들러
 * @param th
 * @return
 */
@ControllerAdvice
public class DefaultExceptionHandler {

	private final Logger logger = LoggerFactory.getLogger(getClass());
	
	@ExceptionHandler(Throwable.class)
	public String anyException(Throwable th) {
		logger.error(th.getMessage(), th);
		return null;
	}
}
