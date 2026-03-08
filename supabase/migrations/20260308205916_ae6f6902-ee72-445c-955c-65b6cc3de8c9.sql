
-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies for avatars
CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Users can update own avatars" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars');
CREATE POLICY "Users can delete own avatars" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars');

-- Create profiles for existing users who don't have one
INSERT INTO public.profiles (user_id, username)
SELECT id, COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1))
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.profiles)
ON CONFLICT DO NOTHING;

-- Insert sample experiences using real user IDs
INSERT INTO public.experiences (id, title, type, content, author_id, views, helpful_count, difficulty, verified) VALUES
('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'Won 1st Place at HackMIT 2025', 'hackathon',
'{"team_size": "4", "duration": "36 hours", "tech_stack": ["React", "Python", "TensorFlow", "Firebase"], "result": "1st Place Overall", "what_went_well": "Great team chemistry and clear division of work.", "challenges": "ML model memory limits required optimization.", "lessons": "Start with the demo. Build what judges will see first."}'::jsonb,
'97b95438-b01f-4a87-a207-08e86d62748d', 234, 45, 'advanced', true),

('b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Google SWE Interview Experience - L4', 'interview',
'{"company": "Google", "role": "Software Engineer L4", "rounds": "5 rounds", "questions": "Graph traversal, DP optimization, System design", "outcome": "Offer received", "preparation": "3 months LeetCode, System Design Primer", "tips": "Think out loud. Ask clarifying questions."}'::jsonb,
'97b95438-b01f-4a87-a207-08e86d62748d', 567, 89, 'advanced', true),

('c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'Building a Full-Stack SaaS in 30 Days', 'project',
'{"tech_stack": ["Next.js", "TypeScript", "Supabase", "Stripe"], "duration": "30 days", "description": "Built a project management tool from idea to paying customers.", "challenges": "Auth edge cases, Stripe webhooks", "outcome": "50 beta users, $500 MRR", "link": ""}'::jsonb,
'eec79fcf-2059-4dea-ae02-22762158b99f', 342, 67, 'intermediate', false),

('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'React Conf 2025 Recap', 'conference',
'{"name": "React Conf 2025", "location": "Henderson, NV", "talks": "Server Components deep dive, React compiler", "networking": "Met collaborators for open source project", "takeaways": "Server components are the future."}'::jsonb,
'eec79fcf-2059-4dea-ae02-22762158b99f', 189, 34, 'beginner', false),

('e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b', 'Failed My Amazon Interview - Lessons Learned', 'interview',
'{"company": "Amazon", "role": "SDE II", "rounds": "4 rounds", "questions": "Leadership principles, medium-hard LeetCode", "outcome": "Rejected", "preparation": "2 months, focused too much on coding", "tips": "Amazon is 50% behavioral. Prepare STAR stories."}'::jsonb,
'97b95438-b01f-4a87-a207-08e86d62748d', 891, 123, 'intermediate', false),

('f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c', 'Hackathon Survival Guide - 10 Events Later', 'hackathon',
'{"team_size": "3-5", "duration": "24-48 hours", "tech_stack": ["Various"], "result": "Won 3, placed top 5 in 4", "what_went_well": "Go-to tech stack, focusing on pitch", "challenges": "Burnout, scope creep, WiFi issues", "lessons": "Bring hotspot. Have template repo. Practice pitch."}'::jsonb,
'eec79fcf-2059-4dea-ae02-22762158b99f', 456, 78, 'beginner', true),

('a7b8c9d0-e1f2-4a3b-4c5d-6e7f8a9b0c1d', 'Open Source - From Zero to Core Maintainer', 'project',
'{"tech_stack": ["TypeScript", "Node.js", "GitHub Actions"], "duration": "6 months", "description": "From fixing typos to core maintainer of a 5k-star project.", "challenges": "Imposter syndrome, massive codebases", "outcome": "Core maintainer, 200+ contributions", "link": ""}'::jsonb,
'97b95438-b01f-4a87-a207-08e86d62748d', 278, 56, 'beginner', false),

('b8c9d0e1-f2a3-4b4c-5d6e-7f8a9b0c1d2e', 'KubeCon 2025 - Cloud Native Insights', 'conference',
'{"name": "KubeCon NA 2025", "location": "Salt Lake City, UT", "talks": "eBPF workshops, Kubernetes security", "networking": "3 job referrals from sponsor booths", "takeaways": "Platform engineering is hot. Learn K8s operators."}'::jsonb,
'eec79fcf-2059-4dea-ae02-22762158b99f', 167, 29, 'intermediate', false);

-- Insert sample tags
INSERT INTO public.tags (name) VALUES
('React'), ('Python'), ('System Design'), ('Machine Learning'),
('TypeScript'), ('Kubernetes'), ('Open Source'), ('Career Growth')
ON CONFLICT DO NOTHING;
