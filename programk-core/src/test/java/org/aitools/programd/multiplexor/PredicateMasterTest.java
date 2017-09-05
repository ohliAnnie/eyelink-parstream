package org.aitools.programd.multiplexor;

import org.aitools.programd.Core;
import org.aitools.programd.util.URLTools;
import org.junit.Before;
import org.junit.Test;

import java.io.FileNotFoundException;
import java.net.URL;

import static org.junit.Assert.*;

public class PredicateMasterTest {

    private Core core;

    @Before
    public void setUp() throws FileNotFoundException {
        String config = "C:\\EEProject\\workspace\\programk-git\\programk-core\\src\\main\\resources\\conf\\core.xml";
        URL baseURL = URLTools.createValidURL(System.getProperty("user.dir"));
        this.core = new Core(baseURL, URLTools.createValidURL(config));
    }


    @Test
    public void test() {
        PredicateMaster example = new PredicateMaster(this.core);
        String s = example.get("that", 1, "12345", "SampleBot");
        System.out.println(s);
        this.core.getResponse("I like mango", "12345", "SampleBot");
        s = example.get("that", 1, "12345", "SampleBot");
        System.out.println(s);
    }

    @Test
    public void testSet() throws Exception {
        PredicateMaster master = new PredicateMaster(this.core);

        String name = "that.1";
        String value = "I like tomato";
        String userid = "redpunk";
        String botid = "SampleBot";

        String set = master.set(name, value, userid, botid);

        System.out.println(set);

    }

    @Test
    public void testSet1() throws Exception {

    }

    @Test
    public void testPush() throws Exception {

    }

    @Test
    public void testGet() throws Exception {

    }

    @Test
    public void testGet1() throws Exception {

    }

    @Test
    public void testSaveAll() throws Exception {

    }
}