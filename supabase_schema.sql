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

CREATE TABLE IF NOT EXISTS public.food_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    year TEXT NOT NULL,
    food_type TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT valid_year CHECK (
        year IN (
            'First Year',
            'Second Year',
            'Third Year',
            'Fourth Year'
        )
    ),

    CONSTRAINT valid_food_type CHECK (
        food_type IN (
            'Vegetarian',
            'Non-Vegetarian'
        )
    )
);

ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestion_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert suggestions" ON public.suggestions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon select suggestions" ON public.suggestions FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert votes" ON public.suggestion_votes FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon select votes" ON public.suggestion_votes FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert food_preferences" ON public.food_preferences FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon select food_preferences" ON public.food_preferences FOR SELECT TO anon USING (true);

CREATE TABLE IF NOT EXISTS public.performance_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    performance_type TEXT NOT NULL,
    performance_name TEXT,
    participant_name TEXT NOT NULL,
    department TEXT NOT NULL,
    year TEXT NOT NULL,
    group_name TEXT,
    group_members TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT valid_performance_type CHECK (
        performance_type IN (
            'Solo Dance',
            'Solo Song',
            'Group Dance',
            'Group Song',
            'Rampwalk',
            'Extra Performance'
        )
    ),

    CONSTRAINT valid_performance_year CHECK (
        year IN (
            'First Year',
            'Second Year',
            'Third Year',
            'Fourth Year'
        )
    ),

    CONSTRAINT non_empty_participant_name CHECK (
        length(trim(participant_name)) > 0
    ),

    CONSTRAINT non_empty_department CHECK (
        length(trim(department)) > 0
    ),

    CONSTRAINT valid_extra_performance CHECK (
        performance_type != 'Extra Performance' OR (performance_name IS NOT NULL AND length(trim(performance_name)) > 0)
    ),

    CONSTRAINT valid_group_name CHECK (
        performance_type NOT IN ('Group Dance', 'Group Song') OR (group_name IS NOT NULL AND length(trim(group_name)) > 0)
    ),

    CONSTRAINT valid_group_members CHECK (
        performance_type NOT IN ('Group Dance', 'Group Song') OR (group_members IS NOT NULL AND length(trim(group_members)) > 0)
    )
);

ALTER TABLE public.performance_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert performance_registrations" ON public.performance_registrations FOR INSERT TO anon WITH CHECK (true);
