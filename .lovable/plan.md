

# Fitness Operating System V1 - Implementation Plan

## Overview
A production-ready, user-owned fitness platform where trainers program workouts and gyms provide verified facilities. Clean, professional, mobile-first design with no social features.

---

## Phase 1: Foundation & Authentication

### 1.1 Design System Setup
- Clean, light Apple Fitness+ inspired design
- Consistent spacing, typography, and color palette
- Mobile-first responsive layouts
- Minimal, professional UI components

### 1.2 User Authentication
- Email/password registration and login
- Password reset functionality
- Multi-role support (User, Trainer, Gym Admin, Super Admin)
- Role stored in separate table (not profiles) for security
- Session management

### 1.3 Core Database Architecture
- User fitness records (permanent, user-owned)
- Role-based access control with proper RLS policies
- Access permissions system (View/Comment/Edit)
- Audit logging for data access

---

## Phase 2: User Fitness Record

### 2.1 Body & Health Profile
- Height, weight history with tracking
- Auto-calculated BMI
- Optional body fat percentage
- Fitness level assessment

### 2.2 Medical & Safety (Private by Default)
- Current and past injuries tracking
- Pain areas mapping
- Food and supplement allergies
- Doctor restrictions/notes
- Strict privacy controls - user decides who sees what

### 2.3 Nutrition & Intake Logging
- Manual calorie tracking
- Basic macros (protein, carbs, fats)
- Sugar and water intake
- Cheat meal tracking

### 2.4 Supplement History
- Used before / currently using
- Stopped supplements with reasons
- Side effects tracking
- "To discuss later" list for trainer conversations

---

## Phase 3: Goals, Achievements & Timeline

### 3.1 Fitness Goals
- Goal types: Fat loss, Muscle gain, Strength, Endurance, Rehab, General fitness
- Goal setting with targets and timelines
- Progress tracking

### 3.2 Achievements System
- Strength PRs (personal records)
- Weight milestones
- Consistency streaks
- Program completion badges
- Event participation records

### 3.3 Fitness Timeline (Chronological History)
- Gym joined/left dates
- Trainer assignments and changes
- Program changes
- Injuries and recovery periods
- Missed weeks
- Achievements and milestones
- Events participated in

---

## Phase 4: Training System (Core Engine)

### 4.1 Main Dashboard - "What To Do Today"
- Clean, focused view showing only today's workout
- No social feed, no distractions
- Trainer name and workout details prominently displayed
- Quick access to start workout

### 4.2 Daily Workout Structure
- Workout name, trainer, estimated duration
- Safety notes visible before starting
- Each exercise shows: name, sets × reps, weight per side
- Auto-calculated total load
- Rest timer between sets
- Trainer notes per exercise

### 4.3 Workout Execution
- Start workout button (logs timestamp)
- Mark exercises: ✔️ Completed, ❌ Skipped
- Add notes (pain, too heavy, time issue)
- End workout button (logs completion time)
- Lock workout when done

### 4.4 Post-Workout Summary (Analysis Only)
- Completion percentage
- Skipped exercises list
- Total volume lifted
- Cardio completed
- Consistency streak display
- **No AI advice - just data presentation**

### 4.5 Midnight Auto-Reset
- Day locks at 12:00 AM local time
- Missed workouts auto-marked
- Next day's workout auto-loads

### 4.6 Workout Time Preferences
- Morning/Evening/Custom time setting
- Configurable reminder notifications

---

## Phase 5: Cardio & Daily Movement

### 5.1 Cardio Logging
- Types: Walking, Running, Cycling, Swimming, Skipping, HIIT
- Duration, distance (optional), intensity
- Integrated into daily view

### 5.2 Daily Movement
- Manual step count entry
- Active minutes tracking

---

## Phase 6: Trainer System

### 6.1 Trainer Dashboard
- Client list and management
- Quick access to design weekly programs

### 6.2 Weekly Program Design
- Select body part → Load exercise library
- Set sets, reps, weight for each exercise
- Save and assign to user(s)
- Week-by-week planning

### 6.3 Custom Exercises
- Trainers can create custom exercise names
- Private to that trainer (not global)
- Reusable across their clients

### 6.4 Trainer Notes System
- Private notes (trainer only sees)
- Shared notes (user can see)
- Full history preserved forever

### 6.5 User Feedback Requests
- User can request: weight reduction, exercise modification
- Flag pain issues, equipment problems
- Trainer sees and can modify next session

---

## Phase 7: Gym System

### 7.1 Gym Profile
- Facilities list
- Trainer roster
- Classes and events
- Image gallery (Supabase storage)
- Location with map
- Optional social/pro links
- Equipment and atmosphere ratings

### 7.2 Gym Verification
- Photo upload requirement
- Owner/manager ID verification
- Verification badge display

### 7.3 Gym Management Controls
- Assign trainers to users
- View trainer quality analytics
- Create classes and events
- Send announcements
- **Gym never owns user data** - only permissioned access

### 7.4 Trainer-User Connection
- Option 1: Gym assigns trainers to users
- Option 2: Independent trainers connect directly with users
- Both supported in same system

---

## Phase 8: Events & Classes

### 8.1 Event Creation
- Types: Workshops, Bootcamps, Challenges, Marathons
- Date, location, capacity
- Paid/free designation
- Registration management

### 8.2 Class Scheduling
- Recurring class schedules
- Instructor assignment
- Capacity limits

### 8.3 Discovery (Minimal)
- Before login: Show nearby gyms and events only
- After login: User data first, discovery on demand
- No feed, no algorithm

---

## Phase 9: Notifications

### 9.1 Workout Reminders
- User-configurable: 2hr, 1hr, 30min, 15min before
- Alarm-style push notifications

### 9.2 Gym/Trainer Broadcasts
- Plain text only
- Categories: Holiday, Class, Event, Announcement
- Push + in-app display
- Auto-delete after 7 days

### 9.3 Birthday Notifications
- Platform sends default message
- Includes gym/trainer name
- Personal but not intrusive

---

## Phase 10: Access Control & Safety

### 10.1 Permission Levels
- View only
- View + Comment
- View + Edit
- User controls who gets what access

### 10.2 Access Audit Log
- Who accessed user data
- When they accessed it
- Duration of access
- Visible to user

### 10.3 Report Concern (Quiet)
- Private reporting system
- Session-linked for context
- Pattern detection for escalation

---

## Phase 11: Ratings System

### 11.1 Trainer Ratings
- Categories: Behavior, Knowledge, Respect, Safety
- ≤2★ requires explanation within 7 days
- No explanation → auto-removal from platform
- 30-45 day decay for no repeat issues
- 3 validated incidents → permanent ban

### 11.2 Gym Ratings
- Equipment quality
- Cleanliness
- Atmosphere
- Simple, public display

---

## Technical Foundation

### Database (Supabase)
- Complex relational schema with foreign keys
- Row-Level Security on all tables
- Separate roles table (security best practice)
- Audit logging tables
- Storage buckets for images

### Security
- Server-side validation on all inputs
- Access logging
- Permission checks on every data request
- HTTPS enforced

### Performance
- Optimized queries for daily workout loading
- Efficient timeline rendering
- Responsive design for all screen sizes

---

## What's NOT in V1
- ❌ AI coaching (analysis only, no advice)
- ❌ Social feed
- ❌ Payments/subscriptions (Phase 2)
- ❌ Home training safety add-on (Phase 2)
- ❌ Native mobile apps (Phase 2)
- ❌ Data import from other apps

