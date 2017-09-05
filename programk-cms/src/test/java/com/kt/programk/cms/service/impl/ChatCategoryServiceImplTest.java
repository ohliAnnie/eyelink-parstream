package com.kt.programk.cms.service.impl;

import com.kt.programk.common.code.CategoryType;
import com.kt.programk.common.domain.category.AimlCategory;
import junit.framework.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:/spring/context-root.xml","classpath:servlet-context.xml"})
public class ChatCategoryServiceImplTest {
    @Autowired
    private ChatCategoryServiceImpl categoryService;

    @Test
    public void testCountAll() throws Exception {
    	AimlCategory aimlCategory = new AimlCategory();
        Assert.assertNotNull(categoryService.countAll(aimlCategory));
    }

    @Test
    public void testCountByCpId() throws Exception {
        Assert.assertNotNull(categoryService.countByCpId(1));
    }

    @Test
    public void testFindListAll() throws Exception {
    	AimlCategory aimlCategory = new AimlCategory();
        Assert.assertNotNull(categoryService.findListAll(aimlCategory, 1, 10));
    }

    @Test
    public void testFindListByCpId() throws Exception {
        Assert.assertNotNull(categoryService.findListByCpId(1, 1, 10));
    }

    @Test
    public void testFindById() throws Exception {
        AimlCategory aimlCategory = categoryService.findById(null);
    }

    @Test
    public void testCreate() throws Exception {
        AimlCategory aimlCategory = new AimlCategory();
        aimlCategory.setName("test");
        aimlCategory.setRestriction(CategoryType.USER.getValue());
        aimlCategory.setCpId(0);

        Assert.assertEquals(categoryService.create(aimlCategory),1);
    }

    @Test
    public void testModify() throws Exception {

    }

    @Test
    public void testRemove() throws Exception {

    }
}