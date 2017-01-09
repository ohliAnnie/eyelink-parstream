insert into tb_node_raw
select date_part('YEAR', current_date()) as event_year,
      date_part('MONTH', current_date()) as event_month,
      date_part('DAY', current_date()) as event_day,
      current_timestamp()+32400000 as measure_time,
      current_timestamp()+32400000 as event_time,
      cast('0001.00000003' as VARSTRING) as node_id, event_type, voltage,
      ampere,
      power_factor,
 active_power,reactive_power,apparent_power,amount_active_power,als_level,dimming_level,vibration_x,vibration_y,vibration_z,vibration_max,noise_origin_decibel,noise_origin_frequency,noise_decibel,noise_frequency,
      127.042861 as gps_longitude, 37.667271 as gps_latitude,
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
      127.042861 as gps_longitude, 37.567271 as gps_latitude,
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
 where event_time >= timestamp '2016-12-30 00:00:00'
   and event_time < timestamp '2017-01-07 23:59:59';

   select node_id
   from tb_node_raw
 where event_time >= timestamp '2016-12-13 00:00:00'
   and event_time < timestamp '2016-12-13 23:59:59'

select node_id,gps_longitude,gps_latitude from tb_node_raw where event_time > timestamp '2017-01-01 00:00:00';


create database eyelink;

insert into db (host, db, user, select_priv, insert_priv, update_priv, delete_priv, create_priv, drop_priv)
  values('%', 'eyelink', 'myeye', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y');

insert into user(host, user, password, ssl_cipher, x509_issuer, x509_subject)
values('%', 'myeye', password('myeye'), '', '', '');

GRANT ALL PRIVILEGES ON *.* TO 'myeye'@'%' IDENTIFIED BY '%myeye%' WITH GRANT OPTION;

flush privileges;

commit;

UPDATE user SET plugin='mysql_native_password' WHERE user='myeye';
FLUSH PRIVILEGES;

insert into db (host, db, user, select_priv, insert_priv, update_priv, delete_priv, create_priv, drop_priv)
  values('%', 'eyelink', 'myeye', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y');

GRANT ALL PRIVILEGES ON *.* TO 'myeye'@'local' IDENTIFIED BY '%myeye%' WITH GRANT OPTION;


REVOKE all ON *.* on 'myeye'@'localhost';


create table tb_node_raw (
  user_id varchar(20) not null primary key ,
  user_password varchar(10) not null,
  user_name varchar(10) not null,
  user_nickname varchar(10),
  email varchar(100) not null,
  sex char(1) not null,
  phone varchar(20),
  cellphone varchar(20),
  address varchar(200),
  last_login datetime,
  mem_type char(1) not null,
  reg_date datetime,
  upd_date datetime
);

CREATE TABLE tb_node_raw
(
     node_id varchar(13) not null,
     event_type varchar(10),
     measure_time datetime,
     event_time datetime not null,
     voltage FLOAT,
     ampere FLOAT,
     power_factor FLOAT,
     active_power  FLOAT,
     reactive_power  FLOAT,
     apparent_power  FLOAT,
     amount_active_power FLOAT,
     als_level int,
     dimming_level int,
     vibration_x int,
     vibration_y int,
     vibration_z int,
     vibration_max int,
     noise_origin_decibel int,
     noise_origin_frequency int,
     noise_decibel FLOAT,
     noise_frequency int,
     gps_longitude FLOAT,
     gps_latitude FLOAT,
     gps_altitude FLOAT,
     gps_satellite_count int,
     status_als int,
     status_gps int,
     status_noise int,
     status_vibration int,
     status_power_meter int,
     status_emergency_led_active int,
     status_self_diagnostics_led_active int,
     status_active_mode int,
     status_led_on_off_type int,
     reboot_time datetime,
     event_remain int,
     failfirmwareupdate int
);

delete from tb_node_raw;

insert into tb_node_raw(node_id, event_type, event_time, active_power , ampere, als_level, dimming_level, vibration_x, vibration_y, vibration_z, noise_decibel, noise_frequency)
  values('0001.00000001', '1', '2017-01-03 10:11:20', 220, 98, 4, 10, 100, 100, 300, 10, 10);
insert into tb_node_raw(node_id, event_type, event_time, active_power , ampere, als_level, dimming_level, vibration_x, vibration_y, vibration_z, noise_decibel, noise_frequency)
  values('0001.00000001', '11', '2017-01-03 11:11:20', 150, 100, 2, 15, 100, 100, 360, 11, 210);
insert into tb_node_raw(node_id, event_type, event_time, active_power , ampere, als_level, dimming_level, vibration_x, vibration_y, vibration_z, noise_decibel, noise_frequency)
  values('0001.00000001', '1', '2017-01-03 12:11:20', 230, 102, 7, 0, 100, 100, 301, 12, 10);
insert into tb_node_raw(node_id, event_type, event_time, active_power , ampere, als_level, dimming_level, vibration_x, vibration_y, vibration_z, noise_decibel, noise_frequency)
  values('0001.00000001', '1', '2017-01-03 13:11:20', 225, 100, 7, 1, 100, 200, 320, 10, 10);
insert into tb_node_raw(node_id, event_type, event_time, active_power , ampere, als_level, dimming_level, vibration_x, vibration_y, vibration_z, noise_decibel, noise_frequency)
  values('0001.00000001', '2', '2017-01-03 14:11:20', 221, 105, 6, 5, 100, 230, 301, 15, 20);
insert into tb_node_raw(node_id, event_type, event_time, active_power , ampere, als_level, dimming_level, vibration_x, vibration_y, vibration_z, noise_decibel, noise_frequency)
  values('0001.00000001', '1', '2017-01-03 15:11:20', 120, 110, 4, 7, 110, 200, 380, 10, 30);
insert into tb_node_raw(node_id, event_type, event_time, active_power , ampere, als_level, dimming_level, vibration_x, vibration_y, vibration_z, noise_decibel, noise_frequency)
  values('0001.00000001', '1', '2017-01-03 16:11:20', 130, 100, 1, 30, 100, 100, 307, 30, 20);
insert into tb_node_raw(node_id, event_type, event_time, active_power , ampere, als_level, dimming_level, vibration_x, vibration_y, vibration_z, noise_decibel, noise_frequency)
  values('0001.00000001', '81', '2017-01-03 17:11:20', 220, 100, 3, 25, 100, 120, 310, 20, 200);
insert into tb_node_raw(node_id, event_type, event_time, active_power , ampere, als_level, dimming_level, vibration_x, vibration_y, vibration_z, noise_decibel, noise_frequency)
  values('0001.00000001', '1', '2017-01-03 18:11:20', 210, 90, 4, 7, 120, 100, 350, 10, 20);
insert into tb_node_raw(node_id, event_type, event_time, active_power , ampere, als_level, dimming_level, vibration_x, vibration_y, vibration_z, noise_decibel, noise_frequency)
  values('0001.00000001', '5', '2017-01-03 19:11:20', 211, 100, 2, 32, 100, 200, 302, 3, 30);
insert into tb_node_raw(node_id, event_type, event_time, active_power , ampere, als_level, dimming_level, vibration_x, vibration_y, vibration_z, noise_decibel, noise_frequency)
  values('0001.00000001', '1', '2017-01-03 20:11:20', 230, 120, 4, 8, 150, 200, 340, 18, 40);
insert into tb_node_raw(node_id, event_type, event_time, active_power , ampere, als_level, dimming_level, vibration_x, vibration_y, vibration_z, noise_decibel, noise_frequency)
  values('0001.00000001', '7', '2017-01-03 21:11:20', 221, 100, 5, 10, 100, 200, 330, 10, 200);
insert into tb_node_raw(node_id, event_type, event_time, active_power , ampere, als_level, dimming_level, vibration_x, vibration_y, vibration_z, noise_decibel, noise_frequency)
  values('0001.00000001', '1', '2017-01-03 22:11:20', 220, 100, 4, 10, 110, 100, 370, 15, 70);
insert into tb_node_raw(node_id, event_type, event_time, active_power , ampere, als_level, dimming_level, vibration_x, vibration_y, vibration_z, noise_decibel, noise_frequency)
  values('0001.00000001', '10', '2017-01-03 23:11:20', 220, 110, 1, 29, 111, 200, 350, 5, 200);
insert into tb_node_raw(node_id, event_type, event_time, active_power , ampere, als_level, dimming_level, vibration_x, vibration_y, vibration_z, noise_decibel, noise_frequency)
  values('0001.00000001', '1', sysdate(), 222, 90, 4, 10, 120, 300, 320, 20, 100);

CREATE TABLE tb_node_raw
(
     node_id VARSTRING(13) COMPRESSION NONE MAPPING_FILE_GRANULARITY 256 SINGLE_VALUE CSV_COLUMN 0 SKIP FALSE,
     event_type UINT64 COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 1 SKIP FALSE,
     measure_time DATE SEPARATED BY "year" INDEX RANGE INDEX_GRANULARITY DAY CSV_FORMAT 'YYYY.MM.DD',
     event_time TIMESTAMP INDEX RANGE INDEX_GRANULARITY DAY,
     voltage FLOAT COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 4 SKIP FALSE,
     ampere FLOAT COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 5 SKIP FALSE,
     power_factor FLOAT COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 6 SKIP FALSE,
     active_power  FLOAT COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 7 SKIP FALSE,
     reactive_power  FLOAT COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 8 SKIP FALSE,
     apparent_power  FLOAT COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 9 SKIP FALSE,
     amount_active_power FLOAT COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 10 SKIP FALSE,
     als_level UINT64 COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 11 SKIP FALSE,
     dimming_level UINT64 COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 12 SKIP FALSE,
     vibration_x UINT8 COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 13 SKIP FALSE,
     vibration_y UINT8 COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 14 SKIP FALSE,
     vibration_z UINT8 COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 15 SKIP FALSE,
     vibration_max UINT8 COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 16 SKIP FALSE,
     noise_origin_decibel UINT8 COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 17 SKIP FALSE,
     noise_origin_frequency UINT8 COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 18 SKIP FALSE,
     noise_decibel FLOAT COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 19 SKIP FALSE,
     noise_frequency UINT16 COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 20 SKIP FALSE,
     gps_longitude FLOAT COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 21 SKIP FALSE,
     gps_latitude FLOAT COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 22 SKIP FALSE,
     gps_altitude FLOAT COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 23 SKIP FALSE,
     gps_satellite_count UINT8 COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 24 SKIP FALSE,
     status_als UINT8 COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 25 SKIP FALSE,
     status_gps UINT8 COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 26 SKIP FALSE,
     status_noise UINT8 COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 27 SKIP FALSE,
     status_vibration UINT8 COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 28 SKIP FALSE,
     status_power_meter UINT8 COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 29 SKIP FALSE,
     status_emergency_led_active UINT8 COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 30 SKIP FALSE,
     status_self_diagnostics_led_active UINT8 COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 31 SKIP FALSE,
     status_active_mode UINT8 COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 32 SKIP FALSE,
     status_led_on_off_type UINT8 COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 33 SKIP FALSE,
     reboot_time TIMESTAMP INDEX RANGE INDEX_GRANULARITY DAY,
     event_remain UINT8 COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 35 SKIP FALSE,
     failfirmwareupdate UINT64 COMPRESSION NONE SINGLE_VALUE CSV_COLUMN 36 SKIP FALSE,
     "year" INT16          INDEX EQUAL CSV_COLUMN ETL,
     "month" INT8          INDEX EQUAL CSV_COLUMN ETL,
     "day" INT8          INDEX EQUAL CSV_COLUMN ETL
)


select a.zone_id, b.node_id
  from tb_node_info as a
        left outer join tb_node_raw as b
        on a.node_id = b.node_id;


insert into tb_node_info
select date_part('YEAR', current_date()) as node_year,
      'ZONE-01' as zone_id,
      '0001.00000002' as node_id,
      current_timestamp()- 32400000 as reg_date
from tb_node_info
where zone_id = 'aa'
limit 1;



