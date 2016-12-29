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
where event_type = 1
limit 1;