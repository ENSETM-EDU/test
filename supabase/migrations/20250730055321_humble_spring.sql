/*
  # Initial Schema for Qur'an Memorization Teams App

  1. New Tables
    - `members`
      - `id` (uuid, primary key)
      - `name` (text, not null) - Arabic name of the member
      - `created_at` (timestamp with timezone, default now())
    
    - `pairings`
      - `id` (uuid, primary key)
      - `date` (text, not null) - Date when the pairing was created
      - `pairs` (jsonb, not null) - Array of [name1, name2] pairs
      - `created_at` (timestamp with timezone, default now())

  2. Security
    - Enable RLS on both tables
    - Public read access for latest pairings (guest view)
    - Admin-only write access via authenticated users
    - Full access for authenticated users (admin)
*/

-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create pairings table
CREATE TABLE IF NOT EXISTS pairings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date text NOT NULL,
  pairs jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE pairings ENABLE ROW LEVEL SECURITY;

-- Members policies
CREATE POLICY "Everyone can read members"
  ON members
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert members"
  ON members
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete members"
  ON members
  FOR DELETE
  TO authenticated
  USING (true);

-- Pairings policies
CREATE POLICY "Everyone can read pairings"
  ON pairings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert pairings"
  ON pairings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update pairings"
  ON pairings
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete pairings"
  ON pairings
  FOR DELETE
  TO authenticated
  USING (true);