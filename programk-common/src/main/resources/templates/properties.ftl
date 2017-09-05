<?xml version="1.0" encoding="UTF-8"?>
<properties xmlns="http://aitools.org/programd/4.6/bot-configuration"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://aitools.org/programd/4.6/bot-configuration http://aitools.org/programd/4.6/bot-configuration.xsd">
    <!--This is an example properties set definition.-->
<#list LIST as item>
    <property name="${item.name}" value="${item.val}"/>
</#list>
</properties>
