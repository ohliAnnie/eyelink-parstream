package com.kt.programk.cms.service.impl;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.*;

/**
 * Created by redpunk on 2016-07-08.
 */

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:/spring/context-root.xml","classpath:servlet-context.xml"})

public class FileManageServiceImplTest {
    @Autowired
    private FileManageServiceImpl fileManageService;

    @Test
    public void uploadAiml() throws Exception {
        //insert into deploy_aiml_category select cp_id, id from aiml_category where cp_id =1;
        fileManageService.uploadAiml(60, "C:\\EEProject\\workspace\\programk-git\\programk-cms\\src\\main\\resources\\sample\\aiml.csv");
    }

    @Test
        //insert into deploy_subs_category select cp_id, id from subs_category where cp_id =1;
    public void uploadSubs() throws Exception {
        fileManageService.uploadSubs(1, "C:\\EEProject\\workspaces\\programk\\programk-cms\\src\\main\\resources\\sample\\substitution.csv");
    }

    @Test
    public void uploadProp() throws Exception {
        fileManageService.uploadProp(1, "C:\\EEProject\\workspaces\\programk\\programk-cms\\src\\main\\resources\\sample\\properties.csv");
    }

    @Test
    public void uploadPred() throws Exception {
        fileManageService.uploadPred(1, "C:\\EEProject\\workspaces\\programk\\programk-cms\\src\\main\\resources\\sample\\predicates.csv");
    }

    @Test
    public void downloadAiml() throws Exception {

    }

    @Test
    public void downloadSubs() throws Exception {

    }

    @Test
    public void downloadProp() throws Exception {

    }

    @Test
    public void downloadPred() throws Exception {

    }

}