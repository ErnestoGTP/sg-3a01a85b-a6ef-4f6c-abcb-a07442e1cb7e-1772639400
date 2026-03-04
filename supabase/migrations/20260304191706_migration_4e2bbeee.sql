-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_email ON password_reset_tokens(email);

-- Policy: Anyone can create tokens (for requesting password reset)
CREATE POLICY "Anyone can create reset tokens" ON password_reset_tokens
  FOR INSERT WITH CHECK (true);

-- Policy: Anyone can read their own tokens (for validation)
CREATE POLICY "Anyone can read tokens" ON password_reset_tokens
  FOR SELECT USING (true);

-- Policy: Anyone can update tokens (to mark as used)
CREATE POLICY "Anyone can update tokens" ON password_reset_tokens
  FOR UPDATE USING (true);