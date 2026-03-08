

## Plan: Fix Experience Detail Order, Add Voting/Comments, Add Exam Category, Add GitHub Link

### 1. Fix Experience Detail field ordering

Currently `ExperienceDetail.tsx` renders content fields in arbitrary `Object.entries` order. Will define explicit ordered field lists per experience type so fields display in logical order: description/overview first, then details (duration, tech stack), then outcomes/challenges, then links last.

Also add `github_link` to `fieldLabels` and render it as a clickable link.

### 2. Add GitHub Repo Link to all Create templates

Add a "GitHub Repo Link" input field to Hackathon, Interview (optional), Project, and Conference forms in `Create.tsx`. Include it in `buildContent()` for each type.

### 3. Add new "Exam" experience category

- Add `exam` to the `ExperienceType` type and templates array in `Create.tsx` with a new icon (e.g., `GraduationCap`)
- Add exam-specific form fields: Exam Name, Platform/Organization, Score/Result, Preparation Strategy, Resources Used, Tips, Duration
- Update `Explore.tsx` tabs to include "Exams"
- Update `ExperienceDetail.tsx` with exam icon, color, and field labels
- **Database migration**: Add `'exam'` to the `experience_type` enum

### 4. Implement Voting (Helpful/Unhelpful) on ExperienceDetail

- Add upvote/downvote buttons on the detail page
- On click: insert/update/delete in `votes` table with `user_id`, `experience_id`, `value`
- Show current user's vote state (highlighted button)
- Update `helpful_count` on the experience via a simple count query or increment

### 5. Implement Comments section on ExperienceDetail

- Add a comments section below the experience content card
- Fetch comments for the experience, joined with profiles for username/avatar
- Show a text input for authenticated users to post comments
- Support threaded replies (parent_id) with indent styling
- Delete own comments

### Files to modify:
- `src/pages/ExperienceDetail.tsx` — field ordering, voting, comments, github link display
- `src/pages/Create.tsx` — github link fields, exam template
- `src/pages/Explore.tsx` — exam tab, exam icon/color
- Database migration — add `exam` to `experience_type` enum

