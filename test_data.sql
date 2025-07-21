-- Insert some Light Switches 
INSERT INTO devices (id, name, type, is_enabled, is_on) VALUES
  ('74fa5255-a546-407a-80cb-510ce13041ef', 'Living Room Light', 'Light Switch', true, true), 
  ('735aaae1-b75d-43fd-8b1c-87f345fd3acf', 'Bedroom Light', 'Light Switch', false, false),
   ('0bed0973-3d39-4de7-9987-688f04c02f6c', 'Porch Light', 'Light Switch', true, false);

-- Insert some  Thermosthat
INSERT INTO devices (id, name, type, is_enabled, current_value_1, target_value_1) VALUES
  ('6eeafae8-1153-408a-94cf-737fe7b953d4', 'Living Room Thermostat', 'Thermostat', true, 14, 22),
  ('5955fc40-7e70-4deb-b381-33fd4418e300', 'Bathroom Thermostat', 'Thermostat', false, null, null);
 