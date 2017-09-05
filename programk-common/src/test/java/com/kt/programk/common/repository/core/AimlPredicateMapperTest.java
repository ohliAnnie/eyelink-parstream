package com.kt.programk.common.repository.core;

import com.kt.programk.common.domain.core.AimlPredicate;
import junit.framework.Assert;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:/spring/context-root.xml"})
public class AimlPredicateMapperTest {

    @Autowired
    AimlPredicateMapper predicateMapper;

    @Test
    public void testSelectByPrimaryKey() throws Exception {
    }

    @Test
    public void testSelectList() throws Exception {
        List<AimlPredicate> predicates = predicateMapper.selectList(null);
        Assert.assertNotNull(predicates);
    }

    @Test
    public void testInsert() throws Exception {
        AimlPredicate example = new AimlPredicate();
        example.setBotid("SampleBot");
        example.setUserid("TEST1");
        example.setName("that.1");
        example.setVal("CONNECT");
        int insert = predicateMapper.insert(example);

        Assert.assertTrue(insert > 0);
    }

    @Test
    public void testDeleteByPrimaryKey() throws Exception {
        AimlPredicate example = new AimlPredicate();
        example.setBotid("SampleBot");
        example.setUserid("TEST1");
        example.setName("that.1");
        example.setVal("CONNECT");
        int count = predicateMapper.deleteByPrimaryKey(example);
    }

    @Test
    public void testUpdate() throws Exception {
        AimlPredicate example = new AimlPredicate();
        example.setBotid("SampleBot");
        example.setUserid("TEST1");
        example.setName("that.1");
        example.setVal("CONNECT");
        int count = predicateMapper.updateByPrimaryKeySelective(example);
    }
}