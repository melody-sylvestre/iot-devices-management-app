-- Insert Devices
INSERT INTO devices (id, name, type, is_enabled) VALUES
  ('74fa5255-a546-407a-80cb-510ce13041ef', 'Living Room Light', 'LIGHT_SWITCH', true),
  ('735aaae1-b75d-43fd-8b1c-87f345fd3acf', 'Bedroom Light', 'LIGHT_SWITCH', false),
  ('6eeafae8-1153-408a-94cf-737fe7b953d4', 'Living Room Thermostat', 'THERMOSTAT', true),
  ('5955fc40-7e70-4deb-b381-33fd4418e300', 'Bathroom Thermostat', 'THERMOSTAT', false),
  ('0bed0973-3d39-4de7-9987-688f04c02f6c', 'Porch Light', 'LIGHT_SWITCH', true);

-- Insert LightSwitches (for devices with type LIGHT_SWITCH)
INSERT INTO light_switches (device_id, is_on) VALUES
  ('74fa5255-a546-407a-80cb-510ce13041ef', true),
  ('735aaae1-b75d-43fd-8b1c-87f345fd3acf', null),
  ('0bed0973-3d39-4de7-9987-688f04c02f6c', true);

-- Insert Thermostats (for devices with type THERMOSTAT)
INSERT INTO thermostats (device_id, current_value, target_value) VALUES
  ('6eeafae8-1153-408a-94cf-737fe7b953d4', 21.5, 22.0),
  ('5955fc40-7e70-4deb-b381-33fd4418e300', null, null);