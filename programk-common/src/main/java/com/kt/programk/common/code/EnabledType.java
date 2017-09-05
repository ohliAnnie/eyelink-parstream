package com.kt.programk.common.code;

/**
 * 활성화 상태
 */
public enum EnabledType {
    /**
     * Enable enabled type.
     */
    ENABLE("Y"),
    /**
     * Disable enabled type.
     */
    DISABLE("N");

    /**
     * The Value.
     */
    private String value;

    /**
     * Instantiates a new Enabled type.
     *
     * @param value the value
     */
    EnabledType(String value) {
        this.value = value;
    }

    /**
     * Gets value.
     *
     * @return the value
     */
    public String getValue() {
        return value;
    }
}
