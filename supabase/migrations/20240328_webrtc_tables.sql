-- Create stream_offers table
CREATE TABLE stream_offers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id TEXT NOT NULL,
    offer JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create stream_answers table
CREATE TABLE stream_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id TEXT NOT NULL,
    answer JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create ice_candidates table
CREATE TABLE ice_candidates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id TEXT NOT NULL,
    candidate JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for faster lookups
CREATE INDEX idx_stream_offers_room_id ON stream_offers(room_id);
CREATE INDEX idx_stream_answers_room_id ON stream_answers(room_id);
CREATE INDEX idx_ice_candidates_room_id ON ice_candidates(room_id);

-- Enable Row Level Security (RLS)
ALTER TABLE stream_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ice_candidates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to stream_offers"
    ON stream_offers FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public insert access to stream_offers"
    ON stream_offers FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Allow public read access to stream_answers"
    ON stream_answers FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public insert access to stream_answers"
    ON stream_answers FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Allow public read access to ice_candidates"
    ON ice_candidates FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public insert access to ice_candidates"
    ON ice_candidates FOR INSERT
    TO public
    WITH CHECK (true); 