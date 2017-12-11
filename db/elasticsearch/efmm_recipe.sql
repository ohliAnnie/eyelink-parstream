curl -XPUT  http://m2u-parstream.eastus.cloudapp.azure.com:9200/efmm_management -d '{
    "mappings" : {
      "management" : {
        "properties" : {
          "id" : { "type" : "text", "index" : "not_analyzed" },
          "cid" : { "type" : "text", "index" : "not_analyzed" },
          "type" : { "type" : "text", "index" : "not_analyzed" },
          "variable" : { "type" : "text", "index" : "not_analyzed" },
          "name" : { "type" : "text", "index" : "not_analyzed" },
          "description" : { "type" : "text", "index" : "not_analyzed" },
          "unit" : { "type" : "text", "index" : "not_analyzed" },
          "stepno" : { "type" : "text", "index" : "not_analyzed" },
          "tagname" : { "type" : "text", "index" : "not_analyzed" },
          "datatype" : { "type" : "text", "index" : "not_analyzed" },
          "datasize" : { "type" : "text", "index" : "not_analyzed" },
          "datavalue" : { "type" : "text", "index" : "not_analyzed" },
          "lastupdate" : { "type" : "date" }
        }
      }
    }
  }'

curl -XPUT http://m2u-parstream.eastus.cloudapp.azure.com:9200/efmm_stacking_status-2017.12.07/status/1 -d '{
    "flag": "notching",
    "type": "realtime",
    "cid": "100",
    "sensorType": "recipe",
    "dtTransmitted": "2017-12-07T09:59:59Z",
    "data" : [
      {
        "dtSensed" : "2017-12-07T09:59:59Z",
        "P2090" : 1,
        "P2091" : 10}
    ]
}'

curl -XPUT http://m2u-parstream.eastus.cloudapp.azure.com:9200/efmm_stacking_status-2017.12.07/status/2 -d '{
    "flag": "notching",
    "type": "realtime",
    "cid": "100",
    "sensorType": "recipe",
    "dtTransmitted": "2017-12-07T10:59:59Z",
    "data" : [
      {
        "dtSensed" : "2017-12-07T10:59:59Z",
        "P2092" : 1,
        "P2093" : 10}
    ]
}'