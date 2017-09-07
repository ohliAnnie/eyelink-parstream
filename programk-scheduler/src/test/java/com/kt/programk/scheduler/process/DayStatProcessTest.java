package com.kt.programk.scheduler.process;

import com.kt.programk.common.repository.stat.ClickStatMapper;
import org.apache.camel.Exchange;
import org.apache.camel.impl.DefaultCamelContext;
import org.apache.camel.impl.DefaultExchange;
import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * 일별 통계 테스트
 */

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:/spring/context-root.xml"})

public class DayStatProcessTest {

    @Autowired
    private ClickStatMapper clickStatMapper;

    private DayStatProcess process;

    @Before
    public void setUp() throws Exception {
        process = new DayStatProcess(clickStatMapper);
    }

    @Test
    public void process() throws Exception {
        DefaultCamelContext camelContext = new DefaultCamelContext();
        Exchange exchange = new DefaultExchange(camelContext);
        process.process(exchange);
    }

}