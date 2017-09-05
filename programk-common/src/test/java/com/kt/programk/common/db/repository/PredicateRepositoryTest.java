package com.kt.programk.common.db.repository;

import com.kt.programk.common.data.repository.db.PredicateRepository;
import com.kt.programk.common.db.domain.PredicateDTO;
import org.junit.Assert;
import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.*;

/**
 * Created by Administrator on 2016-07-20.
 */
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:/spring/context-root.xml", "classpath:/spring/context/context-single-redis.xml"})
public class PredicateRepositoryTest {
    @Autowired
    PredicateRepository predicateRepository;
    PredicateDTO dto;

    @Before
    public void setUp() throws Exception {
        dto = new PredicateDTO();
        dto.setUserid("redpunk13");
        dto.setBotid("AutoBot-01");

    }

    /**
     * 조회
     * @throws Exception
     */
    @Test
    public void get() throws Exception {
        //"AutoBot-01_redpunk"
        PredicateDTO predicateDTO = predicateRepository.get(dto);
        Assert.assertNotNull(predicateDTO);
        System.out.println(predicateDTO.getBotid());
        System.out.println(predicateDTO.getUserid());
    }

    /**
     * 입력
     * @throws Exception
     */
    @Test
    public void put() throws Exception {
        predicateRepository.put(dto);
    }

    /**
     * 삭제
     * @throws Exception
     */
    @Test
    public void delete() throws Exception {
        predicateRepository.delete(dto);
    }
}