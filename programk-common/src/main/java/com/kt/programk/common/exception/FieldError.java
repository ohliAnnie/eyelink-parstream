package com.kt.programk.common.exception;

/**
 * 유효성 검사 오류의 정보를 포함하는 클래스
 */
public class FieldError{
    /**
     * The Path.
     */
    private String path;
    /**
     * The Message.
     */
    private String message;

    /**
     * Instantiates a new Field error.
     *
     * @param path    the path
     * @param message the message
     */
    public FieldError(String path, String message) {
        this.path = path;
        this.message = message;
    }

    /**
     * Gets path.
     *
     * @return the path
     */
    public String getPath() {
        return path;
    }

    /**
     * Gets message.
     *
     * @return the message
     */
    public String getMessage() {
        return message;
    }

    /**
     * Sets path.
     *
     * @param path the path
     */
    public void setPath(String path) {
        this.path = path;
    }

    /**
     * Sets message.
     *
     * @param message the message
     */
    public void setMessage(String message) {
        this.message = message;
    }
}
