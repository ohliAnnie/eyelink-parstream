package com.kt.programk.cms.service;

import com.kt.programk.deploy.model.AimlError;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

/**
 * 검증용 배포 서비스 테스트
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:/spring/context-root.xml","classpath:servlet-context.xml"})
public class VerifyDeployServiceTest {
    @Autowired
    private VerifyDeployService verifyDeployService;

    @Test
    public void delpoyAll() throws Exception {
        Assert.assertNotNull(verifyDeployService);

        List<AimlError> aimlErrors = verifyDeployService.delpoyAiml("AutoBot-01", 60, "redpunk");

        if(!aimlErrors.isEmpty()){
            for(AimlError error: aimlErrors){
                System.out.println(error.getMainId() + " " + error.getErrMsg());
            }
        }


        verifyDeployService.deployPred("AutoBot-01", 60, "redpunk");
        verifyDeployService.deployProp("AutoBot-01", 60, "redpunk");
        verifyDeployService.deploySubs("AutoBot-01", 60, "redpunk");
    }

}