-- SQL Schema for Supabase Setup
CREATE TABLE IF NOT EXISTS public.suggestions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    department TEXT NOT NULL,
    year TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.suggestion_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    suggestion_id UUID REFERENCES public.suggestions(id) ON DELETE CASCADE,
    anonymous_token TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_vote_per_token UNIQUE(suggestion_id, anonymous_token)
);

CREATE TABLE IF NOT EXISTS public.food_preference_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    food_type TEXT NOT NULL CHECK (food_type IN ('Vegetarian', 'Non-Vegetarian')),
    anonymous_token TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_food_vote_per_token UNIQUE(food_type, anonymous_token)
);

ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestion_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_preference_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert suggestions" ON public.suggestions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon select suggestions" ON public.suggestions FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert votes" ON public.suggestion_votes FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon select votes" ON public.suggestion_votes FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert food_preference_votes" ON public.food_preference_votes FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon select food_preference_votes" ON public.food_preference_votes FOR SELECT TO anon USING (true);
