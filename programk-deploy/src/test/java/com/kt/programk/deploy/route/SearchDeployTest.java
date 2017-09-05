package com.kt.programk.deploy.route;

import org.junit.Test;

import java.net.InetAddress;
import java.net.UnknownHostException;

import static org.junit.Assert.*;

public class SearchDeployTest {

    @Test
    public void testLocalIp() throws UnknownHostException {
        InetAddress IP = InetAddress.getLocalHost();
        System.out.println("IP of my system is := " + IP.getHostAddress());
    }

}