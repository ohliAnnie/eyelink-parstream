package com.kt.programk.common.repository.admin;

import com.kt.programk.common.code.EnabledType;
import com.kt.programk.common.domain.admin.CpUser;
import com.kt.programk.common.test.Order;
import com.kt.programk.common.test.OrderedRunner;
import junit.framework.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.List;

/**
 * CP 관리자 정보 테스트
 */
@RunWith(OrderedRunner.class)
public class CpUserMapperTest {

    /**
     * 매퍼
     */
    @Autowired
    private CpUserMapper mapper;

    /**
     * 테스트 데이터
     */
    private CpUser user;

    /**
     * 셋업
     *
     * @throws Exception
     */
    @Before
    public void setUp() throws Exception {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/spring/context-root.xml");
        mapper = (CpUserMapper) ctx.getBean("cpUserMapper");

        user = new CpUser();
        user.setUserId("redpunk");
        user.setName("Hello");
        user.setAuth("123");
    }

    /**
     * 사용자 조회
     *
     * @throws Exception
     */
    @Test
    @Order(order = 3)
    public void testSelectByPrimaryKey() throws Exception {
        CpUser cpUser = mapper.selectByPrimaryKey(user);
        Assert.assertNotNull(cpUser);
    }

    /**
     * 목록 조회
     *
     * @throws Exception
     */
    @Test
    @Order(order = 2)
    public void testSelectList() throws Exception {
        List<CpUser> cpUsers = mapper.selectList(user);
        Assert.assertTrue(cpUsers.size() > 0);
    }

    /**
     * 입력
     *
     * @throws Exception
     */
    @Test
    @Order(order = 1)
    public void testInsert() throws Exception {

        user.setEnabled(EnabledType.ENABLE.getValue());
        int count = mapper.insert(user);
        Assert.assertTrue(count == 1);
    }

    /**
     * 삭제
     *
     * @throws Exception
     */
    @Test
    @Order(order = 5)
    public void testDeleteByPrimaryKey() throws Exception {
        int count = mapper.deleteByPrimaryKey(user);
        Assert.assertTrue(count == 1);
    }

    /**
     * 수정
     */
    @Test
    @Order(order = 4)
    public void testUpdateByPrimaryKeySelective() {
        user.setUserId("redpunk");
        user.setName("redpunk11");

        int count = mapper.updateByPrimaryKeySelective(user);
        Assert.assertTrue(count == 1);
    }
}