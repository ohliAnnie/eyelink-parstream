package com.kt.programk.deploy.service;

import com.google.gson.Gson;
import com.kt.programk.common.wo.ProgramkResponse;
import org.aitools.programd.Core;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Created by Administrator on 2016-08-18.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:/spring/context-root.xml", "classpath:/spring/context/context-single-redis.xml"})
public class DeployServiceTest {
    @Autowired
    private DeployService deployService;


    @Test
    public void makeResponse1() throws Exception {

    }

    @Test
    public void makeResponse() throws Exception {
        Core core = mock(Core.class);
        Gson gson = new Gson();

        DeployService deployService = new DeployService(core);

        //String response = "{{\"image\":{},\"urls\":[{\"title\":\"\",\"url\":\"\",\"comment\":\"\"}],\"mpatterns\":[{}],\"recommends\":[{}],\"options\":[{\"val\":\"\",\"seq\":1},{\"val\":\"\",\"seq\":2},{\"val\":\"\",\"seq\":3},{\"val\":\"\",\"seq\":4},{\"val\":\"\",\"seq\":5}]}}{{\"image\":{},\"urls\":[{\"title\":\"\",\"url\":\"\",\"comment\":\"\"}],\"mpatterns\":[{}],\"recommends\":[{}],\"options\":[{\"val\":\"\",\"seq\":1},{\"val\":\"\",\"seq\":2},{\"val\":\"\",\"seq\":3},{\"val\":\"\",\"seq\":4},{\"val\":\"\",\"seq\":5}]}}{{\"image\":{\"title\":\"\",\"url\":\"http://m.olleh.com/storage/global/common/event/585/open_02.png\"},\"urls\":[{\"title\":\"??? ??\",\"comment\":\"\",\"url\":\"http://m.olleh.com/cts/membership/ingEventView.do?seq=585\"}],\"mpatterns\":[{\"replyInput\":\"??? ??? ??? ?? 1\"},{\"replyInput\":\"??? ??? ??? ?? 2\"},{\"replyInput\":\"??? ??? ??? ?? 3\"},{\"replyInput\":\"??? ??? ??? ?? 4\"},{\"replyInput\":\"???? ??? ??? ? ??\"}],\"recommends\":[{}],\"options\":[{\"val\":\"\"},{\"val\":\"\"},{\"val\":\"SWIPE\"}]}}????? 1Q?? Daily ?? ???|1000000002|1000000483";
        String response = "{{\"image\":{},\"urls\":[{\"title\":\"\",\"url\":\"\",\"comment\":\"\"}],\"mpatterns\":[{}],\"recommends\":[{}],\"options\":[{\"val\":\"\",\"seq\":1},{\"val\":\"\",\"seq\":2},{\"val\":\"\",\"seq\":3},{\"val\":\"\",\"seq\":4},{\"val\":\"\",\"seq\":5}]}}?????7{{\"image\":{\"title\":\"\",\"url\":\"http://image.shop.olleh.com/upload/product/WL00040307/1470297665037.jpg\"},\"urls\":[{\"title\":\"?????7\",\"comment\":\"\",\"url\":\"http://m.shop.olleh.com/m/smart/productView.do?prodNo=WL00040307\"}],\"mpatterns\":[{\"replyInput\":\"??? ?? ??? ?? 1 ???\"},{\"replyInput\":\"??? ?? ??? ?? 2 ???\"},{\"replyInput\":\"??? ?? ??? ?? 3 ???\"},{\"replyInput\":\"??? ?? ??? ?? 4 ???\"},{\"replyInput\":\"??? ?? ? ?? ???\"}],\"recommends\":[{}],\"options\":[{\"val\":\"\"},{\"val\":\"\"},{\"val\":\"SWIPE\"}]}}|1000000006";
        when(core.getResponse(any(String.class), any(String.class), any(String.class))).thenReturn(response);

        List<ProgramkResponse> programkResponses = new ArrayList<>();
        deployService.makeResponse(programkResponses, "a", "b", "c", true, null);

        System.out.println(gson.toJson(programkResponses));
    }

}