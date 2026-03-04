-- Enable public read access to workshop_config
ALTER TABLE workshop_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to workshop_config"
ON workshop_config FOR SELECT
USING (true);

-- Ensure there is at least one row
INSERT INTO workshop_config (title, date, time, location, price)
VALUES (
  'Taller Presencial de PNL Básica',
  '2026-03-21',
  '10:00 AM - 12:00 PM',
  'Hermosillo, Sonora',
  '$750 MXN'
) ON CONFLICT DO NOTHING;