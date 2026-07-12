-- SQL Script to create the synchronized orders table in Supabase
-- Copy and run this script in your Supabase SQL Editor:

CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    discord_username TEXT NOT NULL,
    items JSONB NOT NULL,
    total NUMERIC NOT NULL,
    payment_method TEXT NOT NULL,
    payment_details JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending',
    date TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    tracking_code TEXT,
    alerts JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) so the app can communicate with this table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create full read/write access policies for the store operations
CREATE POLICY "Enable read access for all" ON orders FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all" ON orders FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete access for all" ON orders FOR DELETE USING (true);
