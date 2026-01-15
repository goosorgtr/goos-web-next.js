-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID REFERENCES roles(id),
  email TEXT UNIQUE,
  tc_no TEXT UNIQUE,
  address TEXT,
  profile_image_url TEXT,
  date_of_birth DATE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (name, is_active) VALUES
  ('admin', true),
  ('veli', true),
  ('ogrenci', true),
  ('ogretmen', true),
  ('kantinci', true),
  ('servici', true)
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_tc_no ON users(tc_no);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_roles_updated_at ON roles;
CREATE TRIGGER update_roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Enable read access for authenticated users" ON users
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON users
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on id" ON users
  FOR UPDATE
  USING (auth.uid() = id OR auth.role() = 'service_role');

CREATE POLICY "Enable delete for service role only" ON users
  FOR DELETE
  USING (auth.role() = 'service_role');

-- RLS Policies for roles table
CREATE POLICY "Enable read access for authenticated users" ON roles
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for service role" ON roles
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Enable update for service role" ON roles
  FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Enable delete for service role" ON roles
  FOR DELETE
  USING (auth.role() = 'service_role');
