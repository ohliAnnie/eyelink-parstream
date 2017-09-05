package org.aitools.programd;

import com.google.gson.Gson;
import junit.framework.Assert;
import org.aitools.programd.multiplexor.PredicateMap;
import org.aitools.programd.multiplexor.PredicateValue;
import org.aitools.programd.util.URLTools;
import org.junit.Before;
import org.junit.Test;

import java.io.FileNotFoundException;
import java.net.URL;
import java.util.Scanner;

import static org.junit.Assert.*;

public class CoreTest {

    private Core core;

    @Before
    public void setUp() throws FileNotFoundException {
//        String config = "C:\\EEProject\\workspace\\programk-git\\programk-core\\src\\main\\resources\\conf\\core.xml";
//        URL baseURL = URLTools.createValidURL(System.getProperty("user.dir"));
//        this.core = new Core(baseURL, URLTools.createValidURL(config));
    }

    @Test
    public void testGson(){
        Gson gson = new Gson();
        PredicateMap predicateMap = new PredicateMap();
        predicateMap.put("input", new PredicateValue("test"));

        String s = gson.toJson(predicateMap);
        System.out.println(s);

        PredicateMap predicateMap1 = gson.fromJson(s, PredicateMap.class);

        System.out.println(predicateMap1.size());
    }

    @Test
    public void testThat() throws Exception {
        Assert.assertNotNull(core);
        System.out.println(this.core.getResponse("WHAT ABOUT MOVIES", "12345", "SampleBot"));
        System.out.println(this.core.getResponse("WHAT ABOUT MOVIES", "333333", "SampleBot"));
        System.out.println(this.core.getResponse("YES", "12345", "SampleBot"));
        System.out.println(this.core.getResponse("NO", "333333", "SampleBot"));
//        core.getPredicateMaster().saveAll();
//        core.shutdown();
    }

    @Test
    public void testStar() throws Exception {
        Assert.assertNotNull(core);
        System.out.println(this.core.getResponse("I like mango", "12345", "SampleBot"));
        System.out.println(this.core.getResponse("A mango is a fruit", "12345", "SampleBot"));
        core.shutdown();
    }

    @Test
    public void testLoad() throws Exception {
        String path = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
                "<bots xmlns=\"http://aitools.org/programd/4.6/bot-configuration\"\n" +
                "    xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n" +
                "    xsi:schemaLocation=\"http://aitools.org/programd/4.6/bot-configuration http://aitools.org/programd/4.6/bot-configuration.xsd\">\n" +
                "    <bot id=\"AutoBot-01\" enabled=\"true\">\n" +
                "        <properties href=\"database:/var//properties.xml\"/>\n" +
                "        <predicates href=\"file:/var/predicates.xml\"/>\n" +
                "        <substitutions href=\"file:/var/substitutions.xml\"/>\n" +
                "        <sentence-splitters href=\"classpath:conf/sentence-splitters.xml\"/>\n" +
                "        <learn>file:/var/AIML.aiml</learn>\n" +
                "    </bot>\n" +
                "\t<bot id=\"AutoBot-02\" enabled=\"true\">\n" +
                "        <properties href=\"file:/var//properties.xml\"/>\n" +
                "        <predicates href=\"file:/var/predicates.xml\"/>\n" +
                "        <substitutions href=\"file:/var/substitutions.xml\"/>\n" +
                "        <sentence-splitters href=\"classpath:conf/sentence-splitters.xml\"/>\n" +
                "        <learn>file:/var/AIML.aiml</learn>\n" +
                "    </bot> \n" +
                "</bots>\n";

        URL url = new URL("http://test");

        core.loadBots(url);
    }

    @Test
    public void testReload() throws Exception {

    }

    @Test
    public void testLoadBots() throws Exception {

    }

    @Test
    public void testLoadBot() throws Exception {

    }

    @Test
    public void testUnloadBot() throws Exception {

    }

    @Test
    public void testGetBots() throws Exception {

    }

    @Test
    public void testGetBot() throws Exception {

    }

    @Test
    public void testGetGraphmaster() throws Exception {

    }

    @Test
    public void testGetMultiplexor() throws Exception {

    }

    @Test
    public void testGetPredicateMaster() throws Exception {

    }

    @Test
    public void testGetBotConfigurationElementProcessorRegistry() throws Exception {

    }

    @Test
    public void testGetAIMLProcessorRegistry() throws Exception {

    }

    @Test
    public void testGetAIMLWatcher() throws Exception {

    }

    @Test
    public void testGetSettings() throws Exception {

    }

    @Test
    public void testGetInterpreter() throws Exception {

    }

    @Test
    public void testGetHostname() throws Exception {

    }

    @Test
    public void testGetManagedProcesses() throws Exception {

    }

    @Test
    public void testGetStatus() throws Exception {

    }

    @Test
    public void testGetPluginConfig() throws Exception {

    }

    @Test
    public void testGetBaseURL() throws Exception {

    }

    @Test
    public void testGetLogger() throws Exception {

    }
}