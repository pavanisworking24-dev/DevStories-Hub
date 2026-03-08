

# DevStories - Implementation Plan

## Phase 1: Foundation & Design System

### Theme & Styling
- Dark/light mode toggle using `next-themes` (already installed), with the specified color palette (purple accent #8B5CF6/#A78BFA)
- Inter font, 12px rounded corners, card shadows/glowing borders, micro-interactions with CSS transitions
- Responsive layout: mobile hamburger menu, desktop sidebar nav, max-width 1280px

### Logo & Navigation
- "DevStories" branding with code-bracket icon
- Sidebar nav: Home, Explore, Create, AI Mentor, Bookmarks, Profile

## Phase 2: Backend Setup (Supabase/Lovable Cloud)

### Database Tables
- **profiles** — username, avatar_url, bio, college_company, tech_stack (text[]), impact_score
- **user_roles** — secure role management (admin/moderator/user)
- **experiences** — id, title, type (enum: hackathon/interview/project/conference), content (JSONB for template-specific data), author_id, views, verified, verification_badge
- **tags** + **experience_tags** — many-to-many tagging
- **votes** — user_id, experience_id, value (+1/-1)
- **bookmarks** — user_id, experience_id
- **comments** — threaded Q&A with parent_id
- **verification_requests** — proof uploads, admin review status
- **ai_summaries** — cached AI-generated summaries per experience
- **checklists** — AI-generated checklists per experience
- RLS policies on all tables

### Authentication
- Email/password signup + Google OAuth via Supabase Auth
- Auto-create profile on signup via database trigger

## Phase 3: Core Pages & Experience Posting

### Pages
- **Home/Feed** — trending experiences with category tabs
- **Explore** — search bar with debouncing, advanced filters (category, difficulty, outcome, tech stack, company, date range), sorting options
- **Experience Detail** — full structured view with comments, voting, bookmarking
- **Create Experience** — category selector → dynamic form with the 4 templates (Hackathon, Interview, Project, Conference), each with their specific fields, multi-select tags, rich text areas, image upload
- **Profile** — user's experiences, stats, impact score, verification badges
- **Settings** — theme, notifications, privacy

### Community Features
- Upvote/downvote with impact score calculation
- Threaded comments ("Ask the Author")
- Bookmarking with personal collections
- Content reporting with admin moderation queue

## Phase 4: AI Features (Lovable AI Gateway)

### AI Experience Summary
- Edge function that sends experience content to Lovable AI, returns structured JSON (key lessons, difficulty, prep tips, time investment, one-liner)
- Cached in ai_summaries table, shown as collapsible card on experience pages
- Auto-generated on experience creation

### AI Mentor Chat
- Dedicated chat page with streaming responses
- Edge function using Lovable AI with context from relevant experiences
- Responses cite real platform experiences ("Based on 47 hackathon experiences...")
- Uses Supabase full-text search to find relevant experiences as context

### AI Checklist Generator
- "Generate Checklist" button on experience pages
- Edge function sends experience to AI, returns step-by-step actionable checklist with timing estimates
- Saved to checklists table for reuse

### AI Q&A ("Ask AI About This")
- Per-experience AI Q&A section
- Finds similar experiences via text search, synthesizes answers with citations

## Phase 5: Verification System
- Upload proof (image/PDF) for badges (🏆 Winner, 💼 Employee, 🎤 Speaker)
- Admin review dashboard
- Verified badge display on posts and profiles, higher search ranking

