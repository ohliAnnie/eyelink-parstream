<?xml version="1.0" encoding="UTF-8"?>
<!--Substitutions are grouped according to several AIML interpreter functions.-->
<substitutions xmlns="http://aitools.org/programd/4.6/bot-configuration"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xsi:schemaLocation="http://aitools.org/programd/4.6/bot-configuration http://aitools.org/programd/4.6/bot-configuration.xsd">
    <!--Input substitutions correct spelling mistakes and convert
        "sentence"-ending characters into characters that will not be
        identified as sentence enders.-->
    <input>
<#list LIST as item>
    <substitute find="${item.find}" replace="${item.replace}"/>
</#list>
    </input>
</substitutions>
