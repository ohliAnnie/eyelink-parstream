var queryParser = require('../../routes/dao/queryParser');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  // host: 'http://m2utech.eastus.cloudapp.azure.com:9200',
  // log: 'trace'
});

var sleep = require('system-sleep');

QueryProvider = function() {
};

QueryProvider.prototype.defineMappings = function (newIndex, dataType) {
  logger.trace('Defining mapping for index :', newIndex,', dataType:', dataType);
  if ( dataType == 'm') {
    client.indices.create({
      index: newIndex,
      body: {
        mappings: {
          'stack_motor': {
            properties: {
              "measure_time"             : { "type" : "date", "index" : "not_analyzed"},
              "sepa_unwind"              : { "type" : "integer" },
              "sepa_epc"                 : { "type" : "integer" },
              "feeding_roll"             : { "type" : "integer" },
              "an_el_supply_x"           : { "type" : "integer" },
              "ca_el_supply_x"           : { "type" : "integer" },
              "an_align_y1"              : { "type" : "integer" },
              "an_align_y2"              : { "type" : "integer" },
              "an_align_x"               : { "type" : "integer" },
              "an_el_supply_z"           : { "type" : "integer" },
              "ca_el_supply_z"           : { "type" : "integer" },
              "ca_align_y1"              : { "type" : "integer" },
              "ca_align_y2"              : { "type" : "integer" },
              "ca_align_x"               : { "type" : "integer" },
              "sepa_guide_y"             : { "type" : "integer" },
              "sub_epc"                  : { "type" : "integer" },
              "swing_s"                  : { "type" : "integer" },
              "swing_an_z"               : { "type" : "integer" },
              "swing_ca_z"               : { "type" : "integer" },
              "stack_table_z"            : { "type" : "integer" },
              "stack_anode_mandrel_x1"   : { "type" : "integer" },
              "stack_anode_mandrel_x2"   : { "type" : "integer" },
              "stack_anode_mandrel_z"    : { "type" : "integer" },
              "stack_cathode_mandrel_x1" : { "type" : "integer" },
              "stack_cathode_mandrel_x2" : { "type" : "integer" },
              "stack_cathode_mandrel_z"  : { "type" : "integer" },
              "cutter_y"                 : { "type" : "integer" },
              "pull_s"                   : { "type" : "integer" },
              "pull_y"                   : { "type" : "integer" },
              "winder_x1"                : { "type" : "integer" },
              "winder_x2"                : { "type" : "integer" },
              "winder_s1"                : { "type" : "integer" },
              "winder_s2"                : { "type" : "integer" },
              "bonding_x"                : { "type" : "integer" },
              "bonding_z"                : { "type" : "integer" },
              "turn_table_x"             : { "type" : "integer" },
              "turn_table_s"             : { "type" : "integer" },
              "unloader_y"               : { "type" : "integer" },
              "an_mgn_l_z"               : { "type" : "integer" },
              "an_el_l_z"                : { "type" : "integer" },
              "ca_mgn_l_z"               : { "type" : "integer" },
              "ca_el_l_z"                : { "type" : "integer" },
              "unloader_z"               : { "type" : "integer" },
              "stack_sepa_guide_z"       : { "type" : "integer" },
              "swing_an_z-sub"           : { "type" : "integer" },
              "swing_ca_z-sub"           : { "type" : "integer" }
            }
          }
        }
      }
    }).then(function (resp) {
        logger.trace(resp);
    }, function (err) {
        logger.error(err.message);
    });
  } else if ( dataType == 'a') {
    client.indices.create({
      index: newIndex,
      body: {
        mappings: {
          'stack_alarm': {
            properties: {
              "measure_time"             : { "type" : "date", "index" : "not_analyzed"}
              , "L10000" : { "type" : "integer" }
              , "L10001" : { "type" : "integer" }
              , "L10002" : { "type" : "integer" }
              , "L10003" : { "type" : "integer" }
              , "L10004" : { "type" : "integer" }
              , "L10005" : { "type" : "integer" }
              , "L10006" : { "type" : "integer" }
              , "L10007" : { "type" : "integer" }
              , "L10008" : { "type" : "integer" }
              , "L10009" : { "type" : "integer" }
              , "L10010" : { "type" : "integer" }
              , "L10011" : { "type" : "integer" }
              , "L10012" : { "type" : "integer" }
              , "L10013" : { "type" : "integer" }
              , "L10014" : { "type" : "integer" }
              , "L10015" : { "type" : "integer" }
              , "L10016" : { "type" : "integer" }
              , "L10017" : { "type" : "integer" }
              , "L10018" : { "type" : "integer" }
              , "L10019" : { "type" : "integer" }
              , "L10020" : { "type" : "integer" }
              , "L10021" : { "type" : "integer" }
              , "L10022" : { "type" : "integer" }
              , "L10023" : { "type" : "integer" }
              , "L10024" : { "type" : "integer" }
              , "L10025" : { "type" : "integer" }
              , "L10026" : { "type" : "integer" }
              , "L10027" : { "type" : "integer" }
              , "L10028" : { "type" : "integer" }
              , "L10029" : { "type" : "integer" }
              , "L10030" : { "type" : "integer" }
              , "L10031" : { "type" : "integer" }
              , "L10032" : { "type" : "integer" }
              , "L10033" : { "type" : "integer" }
              , "L10034" : { "type" : "integer" }
              , "L10035" : { "type" : "integer" }
              , "L10036" : { "type" : "integer" }
              , "L10037" : { "type" : "integer" }
              , "L10038" : { "type" : "integer" }
              , "L10039" : { "type" : "integer" }
              , "L10040" : { "type" : "integer" }
              , "L10041" : { "type" : "integer" }
              , "L10042" : { "type" : "integer" }
              , "L10043" : { "type" : "integer" }
              , "L10044" : { "type" : "integer" }
              , "L10045" : { "type" : "integer" }
              , "L10046" : { "type" : "integer" }
              , "L10047" : { "type" : "integer" }
              , "L10048" : { "type" : "integer" }
              , "L10049" : { "type" : "integer" }
              , "L10050" : { "type" : "integer" }
              , "L10051" : { "type" : "integer" }
              , "L10052" : { "type" : "integer" }
              , "L10053" : { "type" : "integer" }
              , "L10054" : { "type" : "integer" }
              , "L10055" : { "type" : "integer" }
              , "L10056" : { "type" : "integer" }
              , "L10057" : { "type" : "integer" }
              , "L10058" : { "type" : "integer" }
              , "L10059" : { "type" : "integer" }
              , "L10060" : { "type" : "integer" }
              , "L10061" : { "type" : "integer" }
              , "L10062" : { "type" : "integer" }
              , "L10063" : { "type" : "integer" }
              , "L10064" : { "type" : "integer" }
              , "L10065" : { "type" : "integer" }
              , "L10066" : { "type" : "integer" }
              , "L10067" : { "type" : "integer" }
              , "L10068" : { "type" : "integer" }
              , "L10069" : { "type" : "integer" }
              , "L10070" : { "type" : "integer" }
              , "L10071" : { "type" : "integer" }
              , "L10072" : { "type" : "integer" }
              , "L10073" : { "type" : "integer" }
              , "L10074" : { "type" : "integer" }
              , "L10075" : { "type" : "integer" }
              , "L10076" : { "type" : "integer" }
              , "L10077" : { "type" : "integer" }
              , "L10078" : { "type" : "integer" }
              , "L10079" : { "type" : "integer" }
              , "L10080" : { "type" : "integer" }
              , "L10081" : { "type" : "integer" }
              , "L10082" : { "type" : "integer" }
              , "L10083" : { "type" : "integer" }
              , "L10084" : { "type" : "integer" }
              , "L10085" : { "type" : "integer" }
              , "L10086" : { "type" : "integer" }
              , "L10087" : { "type" : "integer" }
              , "L10088" : { "type" : "integer" }
              , "L10089" : { "type" : "integer" }
              , "L10090" : { "type" : "integer" }
              , "L10091" : { "type" : "integer" }
              , "L10092" : { "type" : "integer" }
              , "L10093" : { "type" : "integer" }
              , "L10094" : { "type" : "integer" }
              , "L10095" : { "type" : "integer" }
              , "L10096" : { "type" : "integer" }
              , "L10097" : { "type" : "integer" }
              , "L10098" : { "type" : "integer" }
              , "L10099" : { "type" : "integer" }
              , "L10100" : { "type" : "integer" }
              , "L10101" : { "type" : "integer" }
              , "L10102" : { "type" : "integer" }
              , "L10103" : { "type" : "integer" }
              , "L10104" : { "type" : "integer" }
              , "L10105" : { "type" : "integer" }
              , "L10106" : { "type" : "integer" }
              , "L10107" : { "type" : "integer" }
              , "L10108" : { "type" : "integer" }
              , "L10109" : { "type" : "integer" }
              , "L10110" : { "type" : "integer" }
              , "L10111" : { "type" : "integer" }
              , "L10112" : { "type" : "integer" }
              , "L10113" : { "type" : "integer" }
              , "L10114" : { "type" : "integer" }
              , "L10115" : { "type" : "integer" }
              , "L10116" : { "type" : "integer" }
              , "L10117" : { "type" : "integer" }
              , "L10118" : { "type" : "integer" }
              , "L10119" : { "type" : "integer" }
              , "L10120" : { "type" : "integer" }
              , "L10121" : { "type" : "integer" }
              , "L10122" : { "type" : "integer" }
              , "L10123" : { "type" : "integer" }
              , "L10124" : { "type" : "integer" }
              , "L10125" : { "type" : "integer" }
              , "L10126" : { "type" : "integer" }
              , "L10127" : { "type" : "integer" }
              , "L10128" : { "type" : "integer" }
              , "L10129" : { "type" : "integer" }
              , "L10130" : { "type" : "integer" }
              , "L10131" : { "type" : "integer" }
              , "L10132" : { "type" : "integer" }
              , "L10133" : { "type" : "integer" }
              , "L10134" : { "type" : "integer" }
              , "L10135" : { "type" : "integer" }
              , "L10136" : { "type" : "integer" }
              , "L10137" : { "type" : "integer" }
              , "L10138" : { "type" : "integer" }
              , "L10139" : { "type" : "integer" }
              , "L10140" : { "type" : "integer" }
              , "L10141" : { "type" : "integer" }
              , "L10142" : { "type" : "integer" }
              , "L10143" : { "type" : "integer" }
              , "L10144" : { "type" : "integer" }
              , "L10145" : { "type" : "integer" }
              , "L10146" : { "type" : "integer" }
              , "L10147" : { "type" : "integer" }
              , "L10148" : { "type" : "integer" }
              , "L10149" : { "type" : "integer" }
              , "L10150" : { "type" : "integer" }
              , "L10151" : { "type" : "integer" }
              , "L10152" : { "type" : "integer" }
              , "L10153" : { "type" : "integer" }
              , "L10154" : { "type" : "integer" }
              , "L10155" : { "type" : "integer" }
              , "L10156" : { "type" : "integer" }
              , "L10157" : { "type" : "integer" }
              , "L10158" : { "type" : "integer" }
              , "L10159" : { "type" : "integer" }
              , "L10160" : { "type" : "integer" }
              , "L10161" : { "type" : "integer" }
              , "L10162" : { "type" : "integer" }
              , "L10163" : { "type" : "integer" }
              , "L10164" : { "type" : "integer" }
              , "L10165" : { "type" : "integer" }
              , "L10166" : { "type" : "integer" }
              , "L10167" : { "type" : "integer" }
              , "L10168" : { "type" : "integer" }
              , "L10169" : { "type" : "integer" }
              , "L10170" : { "type" : "integer" }
              , "L10171" : { "type" : "integer" }
              , "L10172" : { "type" : "integer" }
              , "L10173" : { "type" : "integer" }
              , "L10174" : { "type" : "integer" }
              , "L10175" : { "type" : "integer" }
              , "L10176" : { "type" : "integer" }
              , "L10177" : { "type" : "integer" }
              , "L10178" : { "type" : "integer" }
              , "L10179" : { "type" : "integer" }
              , "L10180" : { "type" : "integer" }
              , "L10181" : { "type" : "integer" }
              , "L10182" : { "type" : "integer" }
              , "L10183" : { "type" : "integer" }
              , "L10184" : { "type" : "integer" }
              , "L10185" : { "type" : "integer" }
              , "L10186" : { "type" : "integer" }
              , "L10187" : { "type" : "integer" }
              , "L10188" : { "type" : "integer" }
              , "L10189" : { "type" : "integer" }
              , "L10190" : { "type" : "integer" }
              , "L10191" : { "type" : "integer" }
              , "L10192" : { "type" : "integer" }
              , "L10193" : { "type" : "integer" }
              , "L10194" : { "type" : "integer" }
              , "L10195" : { "type" : "integer" }
              , "L10196" : { "type" : "integer" }
              , "L10197" : { "type" : "integer" }
              , "L10198" : { "type" : "integer" }
              , "L10199" : { "type" : "integer" }
              , "L10200" : { "type" : "integer" }
              , "L10201" : { "type" : "integer" }
              , "L10202" : { "type" : "integer" }
              , "L10203" : { "type" : "integer" }
              , "L10204" : { "type" : "integer" }
              , "L10205" : { "type" : "integer" }
              , "L10206" : { "type" : "integer" }
              , "L10207" : { "type" : "integer" }
              , "L10208" : { "type" : "integer" }
              , "L10209" : { "type" : "integer" }
              , "L10210" : { "type" : "integer" }
              , "L10211" : { "type" : "integer" }
              , "L10212" : { "type" : "integer" }
              , "L10213" : { "type" : "integer" }
              , "L10214" : { "type" : "integer" }
              , "L10215" : { "type" : "integer" }
              , "L10216" : { "type" : "integer" }
              , "L10217" : { "type" : "integer" }
              , "L10218" : { "type" : "integer" }
              , "L10219" : { "type" : "integer" }
              , "L10220" : { "type" : "integer" }
              , "L10221" : { "type" : "integer" }
              , "L10222" : { "type" : "integer" }
              , "L10223" : { "type" : "integer" }
              , "L10224" : { "type" : "integer" }
              , "L10225" : { "type" : "integer" }
              , "L10226" : { "type" : "integer" }
              , "L10227" : { "type" : "integer" }
              , "L10228" : { "type" : "integer" }
              , "L10229" : { "type" : "integer" }
              , "L10230" : { "type" : "integer" }
              , "L10231" : { "type" : "integer" }
              , "L10232" : { "type" : "integer" }
              , "L10233" : { "type" : "integer" }
              , "L10234" : { "type" : "integer" }
              , "L10235" : { "type" : "integer" }
              , "L10236" : { "type" : "integer" }
              , "L10237" : { "type" : "integer" }
              , "L10238" : { "type" : "integer" }
              , "L10239" : { "type" : "integer" }
              , "L10240" : { "type" : "integer" }
              , "L10241" : { "type" : "integer" }
              , "L10242" : { "type" : "integer" }
              , "L10243" : { "type" : "integer" }
              , "L10244" : { "type" : "integer" }
              , "L10245" : { "type" : "integer" }
              , "L10246" : { "type" : "integer" }
              , "L10247" : { "type" : "integer" }
              , "L10248" : { "type" : "integer" }
              , "L10249" : { "type" : "integer" }
              , "L10250" : { "type" : "integer" }
              , "L10251" : { "type" : "integer" }
              , "L10252" : { "type" : "integer" }
              , "L10253" : { "type" : "integer" }
              , "L10254" : { "type" : "integer" }
              , "L10255" : { "type" : "integer" }
              , "L10256" : { "type" : "integer" }
              , "L10257" : { "type" : "integer" }
              , "L10258" : { "type" : "integer" }
              , "L10259" : { "type" : "integer" }
              , "L10260" : { "type" : "integer" }
              , "L10261" : { "type" : "integer" }
              , "L10262" : { "type" : "integer" }
              , "L10263" : { "type" : "integer" }
              , "L10264" : { "type" : "integer" }
              , "L10265" : { "type" : "integer" }
              , "L10266" : { "type" : "integer" }
              , "L10267" : { "type" : "integer" }
              , "L10268" : { "type" : "integer" }
              , "L10269" : { "type" : "integer" }
              , "L10270" : { "type" : "integer" }
              , "L10271" : { "type" : "integer" }
              , "L10272" : { "type" : "integer" }
              , "L10273" : { "type" : "integer" }
              , "L10274" : { "type" : "integer" }
              , "L10275" : { "type" : "integer" }
              , "L10276" : { "type" : "integer" }
              , "L10277" : { "type" : "integer" }
              , "L10278" : { "type" : "integer" }
              , "L10279" : { "type" : "integer" }
              , "L10280" : { "type" : "integer" }
              , "L10281" : { "type" : "integer" }
              , "L10282" : { "type" : "integer" }
              , "L10283" : { "type" : "integer" }
              , "L10284" : { "type" : "integer" }
              , "L10285" : { "type" : "integer" }
              , "L10286" : { "type" : "integer" }
              , "L10287" : { "type" : "integer" }
              , "L10288" : { "type" : "integer" }
              , "L10289" : { "type" : "integer" }
              , "L10290" : { "type" : "integer" }
              , "L10291" : { "type" : "integer" }
              , "L10292" : { "type" : "integer" }
              , "L10293" : { "type" : "integer" }
              , "L10294" : { "type" : "integer" }
              , "L10295" : { "type" : "integer" }
              , "L10296" : { "type" : "integer" }
              , "L10297" : { "type" : "integer" }
              , "L10298" : { "type" : "integer" }
              , "L10299" : { "type" : "integer" }
              , "L10300" : { "type" : "integer" }
              , "L10301" : { "type" : "integer" }
              , "L10302" : { "type" : "integer" }
              , "L10303" : { "type" : "integer" }
              , "L10304" : { "type" : "integer" }
              , "L10305" : { "type" : "integer" }
              , "L10306" : { "type" : "integer" }
              , "L10307" : { "type" : "integer" }
              , "L10308" : { "type" : "integer" }
              , "L10309" : { "type" : "integer" }
              , "L10310" : { "type" : "integer" }
              , "L10311" : { "type" : "integer" }
              , "L10312" : { "type" : "integer" }
              , "L10313" : { "type" : "integer" }
              , "L10314" : { "type" : "integer" }
              , "L10315" : { "type" : "integer" }
              , "L10316" : { "type" : "integer" }
              , "L10317" : { "type" : "integer" }
              , "L10318" : { "type" : "integer" }
              , "L10319" : { "type" : "integer" }
              , "L10320" : { "type" : "integer" }
              , "L10321" : { "type" : "integer" }
              , "L10322" : { "type" : "integer" }
              , "L10323" : { "type" : "integer" }
              , "L10324" : { "type" : "integer" }
              , "L10325" : { "type" : "integer" }
              , "L10326" : { "type" : "integer" }
              , "L10327" : { "type" : "integer" }
              , "L10328" : { "type" : "integer" }
              , "L10329" : { "type" : "integer" }
              , "L10330" : { "type" : "integer" }
              , "L10331" : { "type" : "integer" }
              , "L10332" : { "type" : "integer" }
              , "L10333" : { "type" : "integer" }
              , "L10334" : { "type" : "integer" }
              , "L10335" : { "type" : "integer" }
              , "L10336" : { "type" : "integer" }
              , "L10337" : { "type" : "integer" }
              , "L10338" : { "type" : "integer" }
              , "L10339" : { "type" : "integer" }
              , "L10340" : { "type" : "integer" }
              , "L10341" : { "type" : "integer" }
              , "L10342" : { "type" : "integer" }
              , "L10343" : { "type" : "integer" }
              , "L10344" : { "type" : "integer" }
              , "L10345" : { "type" : "integer" }
              , "L10346" : { "type" : "integer" }
              , "L10347" : { "type" : "integer" }
              , "L10348" : { "type" : "integer" }
              , "L10349" : { "type" : "integer" }
              , "L10350" : { "type" : "integer" }
              , "L10351" : { "type" : "integer" }
              , "L10352" : { "type" : "integer" }
              , "L10353" : { "type" : "integer" }
              , "L10354" : { "type" : "integer" }
              , "L10355" : { "type" : "integer" }
              , "L10356" : { "type" : "integer" }
              , "L10357" : { "type" : "integer" }
              , "L10358" : { "type" : "integer" }
              , "L10359" : { "type" : "integer" }
              , "L10360" : { "type" : "integer" }
              , "L10361" : { "type" : "integer" }
              , "L10362" : { "type" : "integer" }
              , "L10363" : { "type" : "integer" }
              , "L10364" : { "type" : "integer" }
              , "L10365" : { "type" : "integer" }
              , "L10366" : { "type" : "integer" }
              , "L10367" : { "type" : "integer" }
              , "L10368" : { "type" : "integer" }
              , "L10369" : { "type" : "integer" }
              , "L10370" : { "type" : "integer" }
              , "L10371" : { "type" : "integer" }
              , "L10372" : { "type" : "integer" }
              , "L10373" : { "type" : "integer" }
              , "L10374" : { "type" : "integer" }
              , "L10375" : { "type" : "integer" }
              , "L10376" : { "type" : "integer" }
              , "L10377" : { "type" : "integer" }
              , "L10378" : { "type" : "integer" }
              , "L10379" : { "type" : "integer" }
              , "L10380" : { "type" : "integer" }
              , "L10381" : { "type" : "integer" }
              , "L10382" : { "type" : "integer" }
              , "L10383" : { "type" : "integer" }
              , "L10384" : { "type" : "integer" }
              , "L10385" : { "type" : "integer" }
              , "L10386" : { "type" : "integer" }
              , "L10387" : { "type" : "integer" }
              , "L10388" : { "type" : "integer" }
              , "L10389" : { "type" : "integer" }
              , "L10390" : { "type" : "integer" }
              , "L10391" : { "type" : "integer" }
              , "L10392" : { "type" : "integer" }
              , "L10393" : { "type" : "integer" }
              , "L10394" : { "type" : "integer" }
              , "L10395" : { "type" : "integer" }
              , "L10396" : { "type" : "integer" }
              , "L10397" : { "type" : "integer" }
              , "L10398" : { "type" : "integer" }
              , "L10399" : { "type" : "integer" }
              , "L10400" : { "type" : "integer" }
              , "L10401" : { "type" : "integer" }
              , "L10402" : { "type" : "integer" }
              , "L10403" : { "type" : "integer" }
              , "L10404" : { "type" : "integer" }
              , "L10405" : { "type" : "integer" }
              , "L10406" : { "type" : "integer" }
              , "L10407" : { "type" : "integer" }
              , "L10408" : { "type" : "integer" }
              , "L10409" : { "type" : "integer" }
              , "L10410" : { "type" : "integer" }
              , "L10411" : { "type" : "integer" }
              , "L10412" : { "type" : "integer" }
              , "L10413" : { "type" : "integer" }
              , "L10414" : { "type" : "integer" }
              , "L10415" : { "type" : "integer" }
              , "L10416" : { "type" : "integer" }
              , "L10417" : { "type" : "integer" }
              , "L10418" : { "type" : "integer" }
              , "L10419" : { "type" : "integer" }
              , "L10420" : { "type" : "integer" }
              , "L10421" : { "type" : "integer" }
              , "L10422" : { "type" : "integer" }
              , "L10423" : { "type" : "integer" }
              , "L10424" : { "type" : "integer" }
              , "L10425" : { "type" : "integer" }
              , "L10426" : { "type" : "integer" }
              , "L10427" : { "type" : "integer" }
              , "L10428" : { "type" : "integer" }
              , "L10429" : { "type" : "integer" }
              , "L10430" : { "type" : "integer" }
              , "L10431" : { "type" : "integer" }
              , "L10432" : { "type" : "integer" }
              , "L10433" : { "type" : "integer" }
              , "L10434" : { "type" : "integer" }
              , "L10435" : { "type" : "integer" }
              , "L10436" : { "type" : "integer" }
              , "L10437" : { "type" : "integer" }
              , "L10438" : { "type" : "integer" }
              , "L10439" : { "type" : "integer" }
              , "L10440" : { "type" : "integer" }
              , "L10441" : { "type" : "integer" }
              , "L10442" : { "type" : "integer" }
              , "L10443" : { "type" : "integer" }
              , "L10444" : { "type" : "integer" }
              , "L10445" : { "type" : "integer" }
              , "L10446" : { "type" : "integer" }
              , "L10447" : { "type" : "integer" }
              , "L10448" : { "type" : "integer" }
              , "L10449" : { "type" : "integer" }
              , "L10450" : { "type" : "integer" }
              , "L10451" : { "type" : "integer" }
              , "L10452" : { "type" : "integer" }
              , "L10453" : { "type" : "integer" }
              , "L10454" : { "type" : "integer" }
              , "L10455" : { "type" : "integer" }
              , "L10456" : { "type" : "integer" }
              , "L10457" : { "type" : "integer" }
              , "L10458" : { "type" : "integer" }
              , "L10459" : { "type" : "integer" }
              , "L10460" : { "type" : "integer" }
              , "L10461" : { "type" : "integer" }
              , "L10462" : { "type" : "integer" }
              , "L10463" : { "type" : "integer" }
              , "L10464" : { "type" : "integer" }
              , "L10465" : { "type" : "integer" }
              , "L10466" : { "type" : "integer" }
              , "L10467" : { "type" : "integer" }
              , "L10468" : { "type" : "integer" }
              , "L10469" : { "type" : "integer" }
              , "L10470" : { "type" : "integer" }
              , "L10471" : { "type" : "integer" }
              , "L10472" : { "type" : "integer" }
              , "L10473" : { "type" : "integer" }
              , "L10474" : { "type" : "integer" }
              , "L10475" : { "type" : "integer" }
              , "L10476" : { "type" : "integer" }
              , "L10477" : { "type" : "integer" }
              , "L10478" : { "type" : "integer" }
              , "L10479" : { "type" : "integer" }
              , "L10480" : { "type" : "integer" }
              , "L10481" : { "type" : "integer" }
              , "L10482" : { "type" : "integer" }
              , "L10483" : { "type" : "integer" }
              , "L10484" : { "type" : "integer" }
              , "L10485" : { "type" : "integer" }
              , "L10486" : { "type" : "integer" }
              , "L10487" : { "type" : "integer" }
              , "L10488" : { "type" : "integer" }
              , "L10489" : { "type" : "integer" }
              , "L10490" : { "type" : "integer" }
              , "L10491" : { "type" : "integer" }
              , "L10492" : { "type" : "integer" }
              , "L10493" : { "type" : "integer" }
              , "L10494" : { "type" : "integer" }
              , "L10495" : { "type" : "integer" }
              , "L10496" : { "type" : "integer" }
              , "L10497" : { "type" : "integer" }
              , "L10498" : { "type" : "integer" }
              , "L10499" : { "type" : "integer" }
              , "L10500" : { "type" : "integer" }
              , "L10501" : { "type" : "integer" }
              , "L10502" : { "type" : "integer" }
              , "L10503" : { "type" : "integer" }
              , "L10504" : { "type" : "integer" }
              , "L10505" : { "type" : "integer" }
              , "L10506" : { "type" : "integer" }
              , "L10507" : { "type" : "integer" }
              , "L10508" : { "type" : "integer" }
              , "L10509" : { "type" : "integer" }
              , "L10510" : { "type" : "integer" }
              , "L10511" : { "type" : "integer" }
              , "L10512" : { "type" : "integer" }
              , "L10513" : { "type" : "integer" }
              , "L10514" : { "type" : "integer" }
              , "L10515" : { "type" : "integer" }
              , "L10516" : { "type" : "integer" }
              , "L10517" : { "type" : "integer" }
              , "L10518" : { "type" : "integer" }
              , "L10519" : { "type" : "integer" }
              , "L10520" : { "type" : "integer" }
              , "L10521" : { "type" : "integer" }
              , "L10522" : { "type" : "integer" }
              , "L10523" : { "type" : "integer" }
              , "L10524" : { "type" : "integer" }
              , "L10525" : { "type" : "integer" }
              , "L10526" : { "type" : "integer" }
              , "L10527" : { "type" : "integer" }
              , "L10528" : { "type" : "integer" }
              , "L10529" : { "type" : "integer" }
              , "L10530" : { "type" : "integer" }
              , "L10531" : { "type" : "integer" }
              , "L10532" : { "type" : "integer" }
              , "L10533" : { "type" : "integer" }
              , "L10534" : { "type" : "integer" }
              , "L10535" : { "type" : "integer" }
              , "L10536" : { "type" : "integer" }
              , "L10537" : { "type" : "integer" }
              , "L10538" : { "type" : "integer" }
              , "L10539" : { "type" : "integer" }
              , "L10540" : { "type" : "integer" }
              , "L10541" : { "type" : "integer" }
              , "L10542" : { "type" : "integer" }
              , "L10543" : { "type" : "integer" }
              , "L10544" : { "type" : "integer" }
              , "L10545" : { "type" : "integer" }
              , "L10546" : { "type" : "integer" }
              , "L10547" : { "type" : "integer" }
              , "L10548" : { "type" : "integer" }
              , "L10549" : { "type" : "integer" }
              , "L10550" : { "type" : "integer" }
              , "L10551" : { "type" : "integer" }
              , "L10552" : { "type" : "integer" }
              , "L10553" : { "type" : "integer" }
              , "L10554" : { "type" : "integer" }
              , "L10555" : { "type" : "integer" }
              , "L10556" : { "type" : "integer" }
              , "L10557" : { "type" : "integer" }
              , "L10558" : { "type" : "integer" }
              , "L10559" : { "type" : "integer" }
              , "L10560" : { "type" : "integer" }
              , "L10561" : { "type" : "integer" }
              , "L10562" : { "type" : "integer" }
              , "L10563" : { "type" : "integer" }
              , "L10564" : { "type" : "integer" }
              , "L10565" : { "type" : "integer" }
              , "L10566" : { "type" : "integer" }
              , "L10567" : { "type" : "integer" }
              , "L10568" : { "type" : "integer" }
              , "L10569" : { "type" : "integer" }
              , "L10570" : { "type" : "integer" }
              , "L10571" : { "type" : "integer" }
              , "L10572" : { "type" : "integer" }
              , "L10573" : { "type" : "integer" }
              , "L10574" : { "type" : "integer" }
              , "L10575" : { "type" : "integer" }
              , "L10576" : { "type" : "integer" }
              , "L10577" : { "type" : "integer" }
              , "L10578" : { "type" : "integer" }
              , "L10579" : { "type" : "integer" }
              , "L10580" : { "type" : "integer" }
              , "L10581" : { "type" : "integer" }
              , "L10582" : { "type" : "integer" }
              , "L10583" : { "type" : "integer" }
              , "L10584" : { "type" : "integer" }
              , "L10585" : { "type" : "integer" }
              , "L10586" : { "type" : "integer" }
              , "L10587" : { "type" : "integer" }
              , "L10588" : { "type" : "integer" }
              , "L10589" : { "type" : "integer" }
              , "L10590" : { "type" : "integer" }
              , "L10591" : { "type" : "integer" }
              , "L10592" : { "type" : "integer" }
              , "L10593" : { "type" : "integer" }
              , "L10594" : { "type" : "integer" }
              , "L10595" : { "type" : "integer" }
              , "L10596" : { "type" : "integer" }
              , "L10597" : { "type" : "integer" }
              , "L10598" : { "type" : "integer" }
              , "L10599" : { "type" : "integer" }
              , "L10600" : { "type" : "integer" }
              , "L10601" : { "type" : "integer" }
              , "L10602" : { "type" : "integer" }
              , "L10603" : { "type" : "integer" }
              , "L10604" : { "type" : "integer" }
              , "L10605" : { "type" : "integer" }
              , "L10606" : { "type" : "integer" }
              , "L10607" : { "type" : "integer" }
              , "L10608" : { "type" : "integer" }
              , "L10609" : { "type" : "integer" }
              , "L10610" : { "type" : "integer" }
              , "L10611" : { "type" : "integer" }
              , "L10612" : { "type" : "integer" }
              , "L10613" : { "type" : "integer" }
              , "L10614" : { "type" : "integer" }
              , "L10615" : { "type" : "integer" }
              , "L10616" : { "type" : "integer" }
              , "L10617" : { "type" : "integer" }
              , "L10618" : { "type" : "integer" }
              , "L10619" : { "type" : "integer" }
              , "L10620" : { "type" : "integer" }
              , "L10621" : { "type" : "integer" }
              , "L10622" : { "type" : "integer" }
              , "L10623" : { "type" : "integer" }
              , "L10624" : { "type" : "integer" }
              , "L10625" : { "type" : "integer" }
              , "L10626" : { "type" : "integer" }
              , "L10627" : { "type" : "integer" }
              , "L10628" : { "type" : "integer" }
              , "L10629" : { "type" : "integer" }
              , "L10630" : { "type" : "integer" }
              , "L10631" : { "type" : "integer" }
              , "L10632" : { "type" : "integer" }
              , "L10633" : { "type" : "integer" }
              , "L10634" : { "type" : "integer" }
              , "L10635" : { "type" : "integer" }
              , "L10636" : { "type" : "integer" }
              , "L10637" : { "type" : "integer" }
              , "L10638" : { "type" : "integer" }
              , "L10639" : { "type" : "integer" }
              , "L10640" : { "type" : "integer" }
              , "L10641" : { "type" : "integer" }
              , "L10642" : { "type" : "integer" }
              , "L10643" : { "type" : "integer" }
              , "L10644" : { "type" : "integer" }
              , "L10645" : { "type" : "integer" }
              , "L10646" : { "type" : "integer" }
              , "L10647" : { "type" : "integer" }
              , "L10648" : { "type" : "integer" }
              , "L10649" : { "type" : "integer" }
              , "L10650" : { "type" : "integer" }
              , "L10651" : { "type" : "integer" }
              , "L10652" : { "type" : "integer" }
              , "L10653" : { "type" : "integer" }
              , "L10654" : { "type" : "integer" }
              , "L10655" : { "type" : "integer" }
              , "L10656" : { "type" : "integer" }
              , "L10657" : { "type" : "integer" }
              , "L10658" : { "type" : "integer" }
              , "L10659" : { "type" : "integer" }
              , "L10660" : { "type" : "integer" }
              , "L10661" : { "type" : "integer" }
              , "L10662" : { "type" : "integer" }
              , "L10663" : { "type" : "integer" }
              , "L10664" : { "type" : "integer" }
              , "L10665" : { "type" : "integer" }
              , "L10666" : { "type" : "integer" }
              , "L10667" : { "type" : "integer" }
              , "L10668" : { "type" : "integer" }
              , "L10669" : { "type" : "integer" }
              , "L10670" : { "type" : "integer" }
              , "L10671" : { "type" : "integer" }
              , "L10672" : { "type" : "integer" }
              , "L10673" : { "type" : "integer" }
              , "L10674" : { "type" : "integer" }
              , "L10675" : { "type" : "integer" }
              , "L10676" : { "type" : "integer" }
              , "L10677" : { "type" : "integer" }
              , "L10678" : { "type" : "integer" }
              , "L10679" : { "type" : "integer" }
              , "L10680" : { "type" : "integer" }
              , "L10681" : { "type" : "integer" }
              , "L10682" : { "type" : "integer" }
              , "L10683" : { "type" : "integer" }
              , "L10684" : { "type" : "integer" }
              , "L10685" : { "type" : "integer" }
              , "L10686" : { "type" : "integer" }
              , "L10687" : { "type" : "integer" }
              , "L10688" : { "type" : "integer" }
              , "L10689" : { "type" : "integer" }
              , "L10690" : { "type" : "integer" }
              , "L10691" : { "type" : "integer" }
              , "L10692" : { "type" : "integer" }
              , "L10693" : { "type" : "integer" }
              , "L10694" : { "type" : "integer" }
              , "L10695" : { "type" : "integer" }
              , "L10696" : { "type" : "integer" }
              , "L10697" : { "type" : "integer" }
              , "L10698" : { "type" : "integer" }
              , "L10699" : { "type" : "integer" }
              , "L10700" : { "type" : "integer" }
              , "L10701" : { "type" : "integer" }
              , "L10702" : { "type" : "integer" }
              , "L10703" : { "type" : "integer" }
              , "L10704" : { "type" : "integer" }
              , "L10705" : { "type" : "integer" }
              , "L10706" : { "type" : "integer" }
              , "L10707" : { "type" : "integer" }
              , "L10708" : { "type" : "integer" }
              , "L10709" : { "type" : "integer" }
              , "L10710" : { "type" : "integer" }
              , "L10711" : { "type" : "integer" }
              , "L10712" : { "type" : "integer" }
              , "L10713" : { "type" : "integer" }
              , "L10714" : { "type" : "integer" }
              , "L10715" : { "type" : "integer" }
              , "L10716" : { "type" : "integer" }
              , "L10717" : { "type" : "integer" }
              , "L10718" : { "type" : "integer" }
              , "L10719" : { "type" : "integer" }
              , "L10720" : { "type" : "integer" }
              , "L10721" : { "type" : "integer" }
              , "L10722" : { "type" : "integer" }
              , "L10723" : { "type" : "integer" }
              , "L10724" : { "type" : "integer" }
              , "L10725" : { "type" : "integer" }
              , "L10726" : { "type" : "integer" }
              , "L10727" : { "type" : "integer" }
              , "L10728" : { "type" : "integer" }
              , "L10729" : { "type" : "integer" }
              , "L10730" : { "type" : "integer" }
              , "L10731" : { "type" : "integer" }
              , "L10732" : { "type" : "integer" }
              , "L10733" : { "type" : "integer" }
              , "L10734" : { "type" : "integer" }
              , "L10735" : { "type" : "integer" }
              , "L10736" : { "type" : "integer" }
              , "L10737" : { "type" : "integer" }
              , "L10738" : { "type" : "integer" }
              , "L10739" : { "type" : "integer" }
              , "L10740" : { "type" : "integer" }
              , "L10741" : { "type" : "integer" }
              , "L10742" : { "type" : "integer" }
              , "L10743" : { "type" : "integer" }
              , "L10744" : { "type" : "integer" }
              , "L10745" : { "type" : "integer" }
              , "L10746" : { "type" : "integer" }
              , "L10747" : { "type" : "integer" }
              , "L10748" : { "type" : "integer" }
              , "L10749" : { "type" : "integer" }
              , "L10750" : { "type" : "integer" }
              , "L10751" : { "type" : "integer" }
              , "L10752" : { "type" : "integer" }
              , "L10753" : { "type" : "integer" }
              , "L10754" : { "type" : "integer" }
              , "L10755" : { "type" : "integer" }
              , "L10756" : { "type" : "integer" }
              , "L10757" : { "type" : "integer" }
              , "L10758" : { "type" : "integer" }
              , "L10759" : { "type" : "integer" }
              , "L10760" : { "type" : "integer" }
              , "L10761" : { "type" : "integer" }
              , "L10762" : { "type" : "integer" }
              , "L10763" : { "type" : "integer" }
              , "L10764" : { "type" : "integer" }
              , "L10765" : { "type" : "integer" }
              , "L10766" : { "type" : "integer" }
              , "L10767" : { "type" : "integer" }
              , "L10768" : { "type" : "integer" }
              , "L10769" : { "type" : "integer" }
              , "L10770" : { "type" : "integer" }
              , "L10771" : { "type" : "integer" }
              , "L10772" : { "type" : "integer" }
              , "L10773" : { "type" : "integer" }
              , "L10774" : { "type" : "integer" }
              , "L10775" : { "type" : "integer" }
              , "L10776" : { "type" : "integer" }
              , "L10777" : { "type" : "integer" }
              , "L10778" : { "type" : "integer" }
              , "L10779" : { "type" : "integer" }
              , "L10780" : { "type" : "integer" }
              , "L10781" : { "type" : "integer" }
              , "L10782" : { "type" : "integer" }
              , "L10783" : { "type" : "integer" }
              , "L10784" : { "type" : "integer" }
              , "L10785" : { "type" : "integer" }
              , "L10786" : { "type" : "integer" }
              , "L10787" : { "type" : "integer" }
              , "L10788" : { "type" : "integer" }
              , "L10789" : { "type" : "integer" }
              , "L10790" : { "type" : "integer" }
              , "L10791" : { "type" : "integer" }
              , "L10792" : { "type" : "integer" }
              , "L10793" : { "type" : "integer" }
              , "L10794" : { "type" : "integer" }
              , "L10795" : { "type" : "integer" }
              , "L10796" : { "type" : "integer" }
              , "L10797" : { "type" : "integer" }
              , "L10798" : { "type" : "integer" }
              , "L10799" : { "type" : "integer" }
              , "L10800" : { "type" : "integer" }
              , "L10801" : { "type" : "integer" }
              , "L10802" : { "type" : "integer" }
              , "L10803" : { "type" : "integer" }
              , "L10804" : { "type" : "integer" }
              , "L10805" : { "type" : "integer" }
              , "L10806" : { "type" : "integer" }
              , "L10807" : { "type" : "integer" }
              , "L10808" : { "type" : "integer" }
              , "L10809" : { "type" : "integer" }
              , "L10810" : { "type" : "integer" }
              , "L10811" : { "type" : "integer" }
              , "L10812" : { "type" : "integer" }
              , "L10813" : { "type" : "integer" }
              , "L10814" : { "type" : "integer" }
              , "L10815" : { "type" : "integer" }
              , "L10816" : { "type" : "integer" }
              , "L10817" : { "type" : "integer" }
              , "L10818" : { "type" : "integer" }
              , "L10819" : { "type" : "integer" }
              , "L10820" : { "type" : "integer" }
              , "L10821" : { "type" : "integer" }
              , "L10822" : { "type" : "integer" }
              , "L10823" : { "type" : "integer" }
              , "L10824" : { "type" : "integer" }
              , "L10825" : { "type" : "integer" }
              , "L10826" : { "type" : "integer" }
              , "L10827" : { "type" : "integer" }
              , "L10828" : { "type" : "integer" }
              , "L10829" : { "type" : "integer" }
              , "L10830" : { "type" : "integer" }
            }
          }
        }
      }
    }).then(function (resp) {
        logger.trace(resp);
    }, function (err) {
        logger.error(err.message);
    });
  }


}

QueryProvider.prototype.indexSettings = function (newIndex, failCount) {
  if ( failCount < 10 ) {
    sleep(1000);
    var self = this;
    client.indices.putSettings({
      index: newIndex,
      body: { "index": { "max_result_window": 100000 } }
    }).then(function (resp) {
        logger.trace(resp);
    }, function (err) {
        logger.debug('failCount(',failCount+1,')', err.message);
        self.indexSettings(newIndex, failCount+1);
    });
  }else {
    logger.error('Index settings skipped because of too many fail count. failCount: '+failCount);
  }
}

QueryProvider.prototype.insertData = function (type, queryId, datas) {
  // console.log('queryId : '+queryId);
   // SQL 내 파라메타를 변경해준다.
  var sQueryString = replaceSql2(queryParser.getQuery(type, queryId), datas);
  // console.log('nodelib-es/insertQueryByID -> ' + sQueryString);

  sQueryString = JSON.parse(sQueryString);
  // console.log(sQueryString);
  // sQueryString = sQueryString.replace(/\r?\n|\r/g, ' ');

  client.index(
    sQueryString
  ).then(function (resp) {
      // console.log(resp);
  }, function (err) {
      logger.error(err.message);
      console.log(sQueryString);
  });
}

QueryProvider.prototype.insertBulkQuery = function (datas, cb) {
  client.bulk(
    {body : makeBulkData(datas)}
  ).then(function (resp) {
      // console.log(resp);
      cb(null, resp);
  }, function (err) {
      console.trace(err.message);
      cb(err.message);
  });
}

makeBulkData = function(datas) {
  var bulkData = [];
  for(var idx=0; idx<datas.body.length; idx++) {
    var obj = {
      index: {
        _index : datas.index,
        _type : datas.type}
    }
    bulkData.push(obj);
    bulkData.push(datas.body[idx]);
  }
  // console.log(bulkData);
  return bulkData;
}

function replaceSql2(sql, params) {
  // var params = {ID : 'AAAA', DATE: '2016-12-12', NUM: 5};
  for (var key in params) {
    // console.log('util/replaceSql2 -> key : %s, value : %s', key, params[key]);
    // if (typeof params[key] === 'object')
    //   console.log('util/replaceSql -> key : %s, value : %s, typeof ', key, params[key], typeof params[key], typeof params[key][0]);

    // 먼저 배열 parameter를 처리한다.
    var re = new RegExp("#" + key + "#","g");
    var re1 = new RegExp("##" + key + "##","g");
    if (typeof params[key] === 'object') {
      if (typeof params[key][0] === 'string') {
        var tsql = '';
        for (var i=0; i<params[key].length; i++) {
          tsql += '"' + params[key][i] + '",';
        }
        tsql = tsql.substring(0, tsql.length-1);
        sql = sql.replace(re1, tsql);
      } else if (typeof params[key][0] === 'number') {
        var tsql = '';
        for (var i=0; i<params[key].length; i++) {
          tsql += params[key][i] + ",";
        }
        tsql = tsql.substring(0, tsql.length-1);
        sql = sql.replace(re1, tsql);
      } else if (typeof params[key][0] === 'undefined') {
        // console.log('test');
        // console.log(key);
        // console.log(params[key][0]);
        throw new Error('Please check sql array params');
      }
    } else if (typeof params[key] === 'string') {
       if(params[key].substring(0,1) == '{'){
       sql = sql.replace(re, params[key]);
      } else {
        sql = sql.replace(re, '"' + params[key] + '"');
      }
    } else if (typeof params[key] === 'number') {
      sql = sql.replace(re, params[key]);
    } else {
      throw new Error('Please check sql params');
    }
  }
  // console.log(sql);
  // sql.should.be.equal("SELECT * FROM A WHERE DATE >= '2016-12-12' AND ID = 'AAAA' AND NUM = 5");
  return sql;
}
exports.QueryProvider = QueryProvider;
