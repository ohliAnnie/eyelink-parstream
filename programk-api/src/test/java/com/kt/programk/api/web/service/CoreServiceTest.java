package com.kt.programk.api.web.service;

import com.google.gson.Gson;
import com.kt.programk.common.wo.ProgramkResponse;
import com.kt.programk.deploy.service.DeployService;
import org.aitools.programd.Core;
import org.junit.Before;
import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Created by Administrator on 2016-07-20.
 */
public class CoreServiceTest {
    private CoreService coreService;
    private DeployService deployService;
    private Core core;
    private Gson gson = new Gson();

    @Before
    public void setUp() throws Exception {
        coreService = new CoreService();
        core = mock(Core.class);
        ReflectionTestUtils.setField(coreService, "core", core);

        String str = "{{\"image\":{},\"urls\":[{\"title\":\"\",\"url\":\"\",\"comment\":\"\"}],\"mpattterns\":[],\"recommends\":[{\"input\":\"소액결제\"}],\"options\":[{\"val\":\"option1\"},{\"val\":\"option2\"},{\"val\":\"option3\"}]}}어서오세요.고객님!;대화로주고받는플러스검색입니다.;;아래의검색어를선택하시거나,;원하는질문을입력후검색해보세요..1000000059";
        when(core.getResponse(any(String.class), any(String.class), any(String.class))).thenReturn(str);
    }

    @Test
    public void makeResponseMap() throws Exception {
        List<ProgramkResponse> programkResponses = new ArrayList<>();
        deployService.makeResponse(programkResponses, "test", "redpunk", "Samplebot", true, null);

        System.out.println(gson.toJson(programkResponses));
    }

}