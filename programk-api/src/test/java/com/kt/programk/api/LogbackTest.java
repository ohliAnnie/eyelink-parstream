package com.kt.programk.api;

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
/**
 * Created by redpunk on 2016-09-22.
 */
public class LogbackTest {
    private static final Logger LOGGER  = LoggerFactory.getLogger( "timeBased" );

    @Test
    public void test(){
        for ( int i = 1; i <= 24; i++ ) {
            LOGGER.info( "write log" );

            try {
                Thread.sleep( 10000L );
            } catch ( final InterruptedException e ) {
                LOGGER.error( "an error occurred", e );
            }
        }
    }
}
