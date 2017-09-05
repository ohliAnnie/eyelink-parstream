/*
 * Copyright 2012 Stormpath, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.kt.programk.api.exhandler;

import org.springframework.http.HttpStatus;
import org.springframework.util.ObjectUtils;


/**
 * The type Rest error.
 */
public class RestError {

    /**
     * The Status.
     */
    private final HttpStatus status;
    /**
     * The Code.
     */
    private final int code;
    /**
     * The Message.
     */
    private final String message;
    /**
     * The Developer message.
     */
    private final String developerMessage;

    /**
     * The Throwable.
     */
    private final Throwable throwable;

    /**
     * Instantiates a new Rest error.
     *
     * @param status the status
     * @param code the code
     * @param message the message
     * @param developerMessage the developer message
     * @param throwable the throwable
     */
    public RestError(HttpStatus status, int code, String message, String developerMessage, Throwable throwable) {
        if (status == null) {
            throw new IllegalArgumentException ("HttpStatus argument cannot be null.");
        }
        this.status = status;
        this.code = code;
        this.message = message;
        this.developerMessage = developerMessage;
        this.throwable = throwable;
    }

    /**
     * Gets status.
     *
     * @return the status
     */
    public HttpStatus getStatus() {
        return status;
    }

    /**
     * Gets code.
     *
     * @return the code
     */
    public int getCode() {
        return code;
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
     * Gets developer message.
     *
     * @return the developer message
     */
    public String getDeveloperMessage() {
        return developerMessage;
    }

    /**
     * Gets throwable.
     *
     * @return the throwable
     */
    public Throwable getThrowable() {
        return throwable;
    }

    /**
     * Equals boolean.
     *
     * @param o the o
     * @return the boolean
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o instanceof RestError) {
            RestError re = (RestError) o;
            return ObjectUtils.nullSafeEquals(getStatus(), re.getStatus()) &&
                    getCode() == re.getCode() &&
                    ObjectUtils.nullSafeEquals(getMessage(), re.getMessage()) &&
                    ObjectUtils.nullSafeEquals(getDeveloperMessage(), re.getDeveloperMessage()) &&
                    ObjectUtils.nullSafeEquals(getThrowable(), re.getThrowable());
        }

        return false;
    }

    /**
     * Hash code.
     *
     * @return the int
     */
    @Override
    public int hashCode() {
        //noinspection ThrowableResultOfMethodCallIgnored
        return ObjectUtils.nullSafeHashCode(new Object[]{
                getStatus(), getCode(), getMessage(), getDeveloperMessage(), getThrowable()
        });
    }

    /**
     * To string.
     *
     * @return the string
     */
    public String toString() {
        //noinspection StringBufferReplaceableByString
        return new StringBuilder().append(getStatus().value())
                .append(" (").append(getStatus().getReasonPhrase()).append(" )")
                .toString();
    }

    /**
     * The type Builder.
     */
    public static class Builder {

        /**
         * The Status.
         */
        private HttpStatus status;
        /**
         * The Code.
         */
        private int code;
        /**
         * The Message.
         */
        private String message;
        /**
         * The Developer message.
         */
        private String developerMessage;
        /**
         * The More info url.
         */
        private String moreInfoUrl;
        /**
         * The Throwable.
         */
        private Throwable throwable;

        /**
         * Instantiates a new Builder.
         */
        public Builder() {
        }

        /**
         * Sets status.
         *
         * @param statusCode the status code
         * @return the status
         */
        public Builder setStatus(int statusCode) {
            this.status = HttpStatus.valueOf(statusCode);
            return this;
        }

        /**
         * Sets status.
         *
         * @param status the status
         * @return the status
         */
        public Builder setStatus(HttpStatus status) {
            this.status = status;
            return this;
        }

        /**
         * Sets code.
         *
         * @param code the code
         * @return the code
         */
        public Builder setCode(int code) {
            this.code = code;
            return this;
        }

        /**
         * Sets message.
         *
         * @param message the message
         * @return the message
         */
        public Builder setMessage(String message) {
            this.message = message;
            return this;
        }

        /**
         * Sets developer message.
         *
         * @param developerMessage the developer message
         * @return the developer message
         */
        public Builder setDeveloperMessage(String developerMessage) {
            this.developerMessage = developerMessage;
            return this;
        }

        /**
         * Sets more info url.
         *
         * @param moreInfoUrl the more info url
         * @return the more info url
         */
        public Builder setMoreInfoUrl(String moreInfoUrl) {
            this.moreInfoUrl = moreInfoUrl;
            return this;
        }

        /**
         * Sets throwable.
         *
         * @param throwable the throwable
         * @return the throwable
         */
        public Builder setThrowable(Throwable throwable) {
            this.throwable = throwable;
            return this;
        }

        /**
         * Build rest error.
         *
         * @return the rest error
         */
        public RestError build() {
            if (this.status == null) {
                this.status = HttpStatus.INTERNAL_SERVER_ERROR;
            }
            return new RestError(this.status, this.code, this.message, this.developerMessage, this.throwable);
        }
    }
}