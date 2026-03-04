-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
  attendance_status TEXT NOT NULL DEFAULT 'pending' CHECK (attendance_status IN ('pending', 'present')),
  qr_code_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workshop_config table
CREATE TABLE IF NOT EXISTS workshop_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  price TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_config ENABLE ROW LEVEL SECURITY;

-- Policies for participants (admin only with specific condition)
CREATE POLICY "Admin can view participants" ON participants FOR SELECT USING (true);
CREATE POLICY "Admin can insert participants" ON participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can update participants" ON participants FOR UPDATE USING (true);
CREATE POLICY "Admin can delete participants" ON participants FOR DELETE USING (true);

-- Policies for workshop_config (public read, admin write)
CREATE POLICY "Anyone can view workshop config" ON workshop_config FOR SELECT USING (true);
CREATE POLICY "Admin can insert workshop config" ON workshop_config FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can update workshop config" ON workshop_config FOR UPDATE USING (true);
CREATE POLICY "Admin can delete workshop config" ON workshop_config FOR DELETE USING (true);

-- Insert default workshop config
INSERT INTO workshop_config (title, date, time, location, price)
VALUES (
  'Taller de PNL Fundamental',
  '2026-04-15',
  '9:00 AM - 6:00 PM',
  'Hermosillo, Sonora',
  '$800 MXN'
) ON CONFLICT DO NOTHING;