<?xml version="1.0" encoding="UTF-8"?>
<bots xmlns="http://aitools.org/programd/4.6/bot-configuration"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://aitools.org/programd/4.6/bot-configuration http://aitools.org/programd/4.6/bot-configuration.xsd">
<#list LIST?keys as attrs>
    <bot id="${attrs}" enabled="true">
    <#list LIST[attrs]?keys as key>
        <#if key == "prop">
            <properties href="file:${LIST[attrs][key]}"/>
        </#if>
        <#if key == "pred">
            <predicates href="file:${LIST[attrs][key]}"/>
        </#if>
        <#if key == "subs">
            <substitutions href="file:${LIST[attrs][key]}"/>
        </#if>
        <#if key == "aiml">
            <learn>file:${LIST[attrs][key]}</learn>
        </#if>
    </#list>
            <sentence-splitters href="classpath:conf/sentence-splitters.xml"/>
    </bot>
</#list>
</bots>
