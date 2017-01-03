insert into tb_node_raw
select date_part('YEAR', current_date()) as event_year,
      date_part('MONTH', current_date()) as event_month,
      date_part('DAY', current_date()) as event_day,
      current_timestamp()+32400000 as measure_time,
      current_timestamp()+32400000 as event_time,
      '0001.00000001' as node_id, event_type, voltage,
      ampere,
      power_factor,
 active_power,reactive_power,apparent_power,amount_active_power,als_level,dimming_level,vibration_x,vibration_y,vibration_z,vibration_max,noise_origin_decibel,noise_origin_frequency,noise_decibel,noise_frequency,
      127.042861 as gps_longitude, 37.467271 as gps_latitude,
gps_altitude, gps_satellite_count,status_als,status_gps,status_noise,status_vibration,status_power_meter,status_emergency_led_active,status_self_diagnostics_led_active,status_active_mode,status_led_on_off_type,reboot_time,event_remain,failfirmwareupdate
from tb_node_raw
where event_type = 1
limit 1;

insert into tb_node_raw
select date_part('YEAR', current_date()) as event_year,
      date_part('MONTH', current_date()) as event_month,
      date_part('DAY', current_date()) as event_day,
      current_timestamp()- 32400000 as measure_time,
      current_timestamp()- 32400000 as event_time,
      '0001.00000002' as node_id, event_type, voltage,
      ampere,
      power_factor,
 active_power,reactive_power,apparent_power,amount_active_power,als_level,dimming_level,vibration_x,vibration_y,vibration_z,vibration_max,noise_origin_decibel,noise_origin_frequency,noise_decibel,noise_frequency,
      127.042861 as gps_longitude, 37.467271 as gps_latitude,
gps_altitude, gps_satellite_count,status_als,status_gps,status_noise,status_vibration,status_power_meter,status_emergency_led_active,status_self_diagnostics_led_active,status_active_mode,status_led_on_off_type,reboot_time,event_remain,failfirmwareupdate
from tb_node_raw
where event_type = 81
limit 1;




   select node_id, event_time, event_type, active_power, ampere,
      als_level, dimming_level,
        noise_decibel, noise_frequency,
        vibration_x, vibration_y, vibration_z,
        (vibration_x + vibration_y + vibration_z) / 3 as vibration
   from tb_node_raw
 where event_time >= timestamp '2016-12-13 00:00:00'
   and event_time < timestamp '2016-12-13 23:59:59'

   select count(*)
   from tb_node_raw
 where event_time >= timestamp '2016-12-13 00:00:00'
   and event_time < timestamp '2016-12-13 23:59:59'


#table_name;column_name;column_type;value_type_oid;sql_type;column_size;mapping_level;mapping_type;mapping_file_granularity;singularity;preload_column;csv_column;csv_column_no;skip;unique;has_unique_constraint;not_null;has_not_null_constraint;primary_key;is_primary_key;default_value;dynamic_columns_type
"tb_node_raw";"node_id";"string";25;"VARSTRING";13;"unknown mapping level";"AUTO";256;"SINGLE_VALUE";"NULL";"0";0;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"event_type";"numeric";1000020;"UINT64";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"1";1;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"measure_time";"datetime";1114;"TIMESTAMP";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"2";2;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"event_time";"datetime";1114;"TIMESTAMP";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"3";3;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"voltage";"numeric";700;"FLOAT";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"4";4;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"ampere";"numeric";700;"FLOAT";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"5";5;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"power_factor";"numeric";700;"FLOAT";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"6";6;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"active_power";"numeric";700;"FLOAT";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"7";7;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"reactive_power";"numeric";700;"FLOAT";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"8";8;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"apparent_power";"numeric";700;"FLOAT";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"9";9;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"amount_active_power";"numeric";700;"FLOAT";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"10";10;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"als_level";"numeric";1000020;"UINT64";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"11";11;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"dimming_level";"numeric";1000020;"UINT64";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"12";12;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"vibration_x";"numeric";1000018;"UINT8";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"13";13;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"vibration_y";"numeric";1000018;"UINT8";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"14";14;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"vibration_z";"numeric";1000018;"UINT8";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"15";15;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"vibration_max";"numeric";1000018;"UINT8";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"16";16;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"noise_origin_decibel";"numeric";1000018;"UINT8";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"17";17;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"noise_origin_frequency";"numeric";1000018;"UINT8";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"18";18;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"noise_decibel";"numeric";700;"FLOAT";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"19";19;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"noise_frequency";"numeric";1000021;"UINT16";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"20";20;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"gps_longitude";"numeric";700;"FLOAT";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"21";21;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"gps_latitude";"numeric";700;"FLOAT";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"22";22;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"gps_altitude";"numeric";700;"FLOAT";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"23";23;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"gps_satellite_count";"numeric";1000018;"UINT8";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"24";24;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"status_als";"numeric";1000018;"UINT8";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"25";25;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"status_gps";"numeric";1000018;"UINT8";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"26";26;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"status_noise";"numeric";1000018;"UINT8";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"27";27;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"status_vibration";"numeric";1000018;"UINT8";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"28";28;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"status_power_meter";"numeric";1000018;"UINT8";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"29";29;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"status_emergency_led_active";"numeric";1000018;"UINT8";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"30";30;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"status_self_diagnostics_led_active";"numeric";1000018;"UINT8";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"31";31;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"status_active_mode";"numeric";1000018;"UINT8";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"32";32;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"status_led_on_off_type";"numeric";1000018;"UINT8";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"33";33;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"reboot_time";"datetime";1114;"TIMESTAMP";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"34";34;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"event_remain";"numeric";1000018;"UINT8";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"35";35;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"failfirmwareupdate";"numeric";1000020;"UINT64";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"36";36;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"event_year";"numeric";21;"INT16";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"ETL";<NULL>;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"event_month";"numeric";18;"INT8";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"ETL";<NULL>;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"
"tb_node_raw";"event_day";"numeric";18;"INT8";<NULL>;"unknown mapping level";"AUTO";0;"SINGLE_VALUE";"NULL";"ETL";<NULL>;"FALSE";"FALSE";0;"FALSE";0;"FALSE";0;"NULL";"REGULAR_COLUMN"


toObjectIter => cmd : node_id 12, type : String, getter : getStringSync
toObjectIter => cmd : event_time 93, type : Timestamp, getter : getTimestampSync
toObjectIter => cmd : event_type 1000020, type : String, getter : getStringSync
toObjectIter => cmd : active_power 7, type : Float, getter : getFloatSync
toObjectIter => cmd : ampere 7, type : Float, getter : getFloatSync
toObjectIter => cmd : als_level 1000020, type : String, getter : getStringSync
toObjectIter => cmd : dimming_level 1000020, type : String, getter : getStringSync
toObjectIter => cmd : noise_decibel 7, type : Float, getter : getFloatSync
toObjectIter => cmd : noise_frequency 1000021, type : String, getter : getStringSync
toObjectIter => cmd : vibration_x 1000018, type : String, getter : getStringSync
toObjectIter => cmd : vibration_y 1000018, type : String, getter : getStringSync
toObjectIter => cmd : vibration_z 1000018, type : String, getter : getStringSync
toObjectIter => cmd : vibration 8, type : Double, getter : getDoubleSync
toObjectIter => cmd : node_id 12, type : String, getter : getStringSync
toObjectIter => cmd : event_time 93, type : Timestamp, getter : getTimestampSync
toObjectIter => cmd : event_type 1000020, type : String, getter : getStringSync
toObjectIter => cmd : active_power 7, type : Float, getter : getFloatSync
toObjectIter => cmd : ampere 7, type : Float, getter : getFloatSync
toObjectIter => cmd : als_level 1000020, type : String, getter : getStringSync
toObjectIter => cmd : dimming_level 1000020, type : String, getter : getStringSync
toObjectIter => cmd : noise_decibel 7, type : Float, getter : getFloatSync
toObjectIter => cmd : noise_frequency 1000021, type : String, getter : getStringSync
toObjectIter => cmd : vibration_x 1000018, type : String, getter : getStringSync
toObjectIter => cmd : vibration_y 1000018, type : String, getter : getStringSync
toObjectIter => cmd : vibration_z 1000018, type : String, getter : getStringSync
toObjectIter => cmd : vibration 8, type : Double, getter : getDoubleSync
toObjectIter => cmd : node_id 12, type : String, getter : getStringSync
toObjectIter => cmd : event_time 93, type : Timestamp, getter : getTimestampSync
toObjectIter => cmd : event_type 1000020, type : String, getter : getStringSync
toObjectIter => cmd : active_power 7, type : Float, getter : getFloatSync
toObjectIter => cmd : ampere 7, type : Float, getter : getFloatSync
toObjectIter => cmd : als_level 1000020, type : String, getter : getStringSync
toObjectIter => cmd : dimming_level 1000020, type : String, getter : getStringSync
toObjectIter => cmd : noise_decibel 7, type : Float, getter : getFloatSync
toObjectIter => cmd : noise_frequency 1000021, type : String, getter : getStringSync
toObjectIter => cmd : vibration_x 1000018, type : String, getter : getStringSync
toObjectIter => cmd : vibration_y 1000018, type : String, getter : getStringSync
toObjectIter => cmd : vibration_z 1000018, type : String, getter : getStringSync
toObjectIter => cmd : vibration 8, type : Double, getter : getDoubleSync


select count(*)
from tb_node_raw   where event_time >= timestamp '2016-12-12 00:00:00'    and event_time < timestamp '2017-01-02 23:59:59'


Using connection: 851cef8a-8232-41fb-9633-6a2987005483
Using connection: a90d0fb4-8a5c-4984-875d-475f177724fd
Using connection: aaef21e8-cff7-4a45-b944-cab101387966
Using connection: ec575bc2-110e-4487-a46f-0103f7eed817
Using connection: 86b4a6c7-6b9d-4bd4-80bd-a500e4f9c27c


Using connection: 86b4a6c7-6b9d-4bd4-80bd-a500e4f9c27c
Using connection: ec575bc2-110e-4487-a46f-0103f7eed817
Using connection: ec575bc2-110e-4487-a46f-0103f7eed817
Using connection: 86b4a6c7-6b9d-4bd4-80bd-a500e4f9c27c

Using connection: 86b4a6c7-6b9d-4bd4-80bd-a500e4f9c27c


private static final Object[][] knownProperties = {
{ "PGDBNAME", Boolean.TRUE, "Database name to connect to; may be specified directly in the JDBC URL." },
{ "user", Boolean.TRUE, "Username to connect to the database as.", null },
{ "PGHOST", Boolean.FALSE, "Hostname of the PostgreSQL server; may be specified directly in the JDBC URL." },
{ "PGPORT", Boolean.FALSE, "Port number to connect to the PostgreSQL server on; may be specified directly in the JDBC URL." },
{ "password", Boolean.FALSE, "Password to use when authenticating." },
{ "protocolVersion", Boolean.FALSE, "Force use of a particular protocol version when connecting; if set, disables protocol version fallback." },
{ "ssl", Boolean.FALSE, "Control use of SSL; any nonnull value causes SSL to be required." },
{ "sslfactory", Boolean.FALSE, "Provide a SSLSocketFactory class when using SSL." },
{ "sslfactoryarg", Boolean.FALSE, "Argument forwarded to constructor of SSLSocketFactory class." },
{ "loglevel", Boolean.FALSE, "Control the driver's log verbosity: 0 is off, 1 is INFO, 2 is DEBUG.", { "0", "1", "2" } },
{ "allowEncodingChanges", Boolean.FALSE, "Allow the user to change the client_encoding variable." },
{ "logUnclosedConnections", Boolean.FALSE, "When connections that are not explicitly closed are garbage collected, log the stacktrace from the opening of the connection to trace the leak source." },
{ "prepareThreshold", Boolean.FALSE, "Default statement prepare threshold (numeric)." },
{ "charSet", Boolean.FALSE, "When connecting to a pre-7.3 server, the database encoding to assume is in use." },
{ "compatible", Boolean.FALSE, "Force compatibility of some features with an older version of the driver.", { "7.1", "7.2", "7.3", "7.4", "8.0", "8.1", "8.2" } },

{ "loginTimeout", Boolean.FALSE, "The login timeout, in seconds; 0 means no timeout beyond the normal TCP connection timout." },
{ "socketTimeout", Boolean.FALSE, "The timeout value for socket read operations, in seconds; 0 means no timeout." },
{ "tcpKeepAlive", Boolean.FALSE, "Enable or disable TCP keep-alive probe." },

{ "stringtype", Boolean.FALSE, "The type to bind String parameters as (usually 'varchar'; 'unspecified' allows implicit casting to other types)", { "varchar", "unspecified" } },
{ "kerberosServerName", Boolean.FALSE, "The Kerberos service name to use when authenticating with GSSAPI.  This is equivalent to libpq's PGKRBSRVNAME environment variable." },
{ "jaasApplicationName", Boolean.FALSE, "Specifies the name of the JAAS system or application login configuration." } };


Using connection: da2cc855-68bc-4586-aed6-a6cbe2865687
Connection {
  _conn:
   nodeJava_com_parstream_jdbc4_ParstreamConnection {
     firstWarning: null,
     bindStringAsVarchar: true,
     readOnly: false,
     autoCommit: true },
  _txniso:
   [ 'TRANSACTION_NONE',
     'TRANSACTION_READ_UNCOMMITTED',
     'TRANSACTION_READ_COMMITTED',
     ,
     'TRANSACTION_REPEATABLE_READ',
     ,
     ,
     ,
     'TRANSACTION_SERIALIZABLE' ] }



