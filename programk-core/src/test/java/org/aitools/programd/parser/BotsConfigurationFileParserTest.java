package org.aitools.programd.parser;

import junit.framework.TestCase;
import org.aitools.programd.Core;
import org.aitools.programd.util.URLTools;
import org.junit.Before;
import org.junit.Test;

import java.io.FileNotFoundException;
import java.net.URL;

public class BotsConfigurationFileParserTest {
    private Core core;
    BotsConfigurationFileParser botsConfigurationFileParser;

    @Before
    public void setup() throws FileNotFoundException {
        String config = "C:\\EEProject\\workspaces\\programk-git\\programk-core\\src\\main\\resources\\conf\\core.xml";
        URL baseURL = URLTools.createValidURL(System.getProperty("user.dir"));
        this.core = new Core(baseURL, URLTools.createValidURL(config));
        botsConfigurationFileParser = new BotsConfigurationFileParser(this.core);
    }

    @Test
    public void testProcess(){

    }
}