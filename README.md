# Fitness Core

## Fitness Operating System (V1 – USER OWNED, TRAINER DRIVEN)

---

## SYSTEM ROLE

You are a **Principal Product Architect, Senior Full-Stack Engineer, and Fitness Domain Expert**.

Your task is to design and generate a **production-ready Fitness Operating System (V1)** with **NO AI coaching yet**.

This system must be:

* User-owned data
* Trainer-driven programming
* Gym-verified
* Safety-first
* Globally scalable
* Mobile-first
* Simple, serious, and non-social

This is **not a demo**.
This is a **real fitness platform**.

---

## CORE PHILOSOPHY (NON-NEGOTIABLE)

1. User owns all fitness data
2. Gym / trainer only get permissioned access
3. Leaving a gym NEVER resets fitness history
4. Access is view / comment / edit only
5. Trust > lock-in
6. No social feed, no spam
7. AI only does analysis & summaries (NO coaching yet)

---

## USER ROLES (MULTI-ROLE SUPPORTED)

* Super Admin
* User (Client)
* Trainer
* Gym Admin / Owner

One account may have multiple roles.

---

## CORE OBJECT: USER FITNESS RECORD

Each user has **ONE permanent fitness record**.

### STORE THE FOLLOWING:

### A. Body & Health

* Height
* Weight history
* BMI (auto)
* Body fat % (optional)
* Fitness level

### B. Medical & Safety (PRIVATE BY DEFAULT)

* Current injuries
* Past injuries
* Pain areas
* Food allergies
* Supplement allergies
* Restrictions / doctor notes

### C. Nutrition & Intake

* Calories (manual)
* Protein / carbs / fats (basic)
* Sugar intake
* Water intake
* Cheat meals

### D. Supplements History

* Used before
* Currently using
* Stopped supplements + reason
* Side effects
* “To discuss later” list

---

## FITNESS GOALS, ACHIEVEMENTS & TIMELINE

### Goals

* Fat loss
* Muscle gain
* Strength
* Endurance
* Rehab
* General fitness

### Achievements

* Strength PRs
* Weight milestones
* Consistency streaks
* Program completed
* Events completed

### FITNESS TIMELINE (CRITICAL)

Chronological timeline showing:

* Gym joined / left
* Trainer changes
* Program changes
* Injuries
* Missed weeks
* Achievements
* Events

---

## TRAINING SYSTEM (CORE ENGINE)

### AFTER LOGIN → MAIN SCREEN

**Show ONLY:**

> “WHAT TO DO TODAY”

No feed. No discovery.

---

### DAILY WORKOUT STRUCTURE

Each workout contains:

* Workout name
* Trainer name
* Estimated duration
* Safety notes

Each exercise includes:

* Exercise name
* Sets × reps
* Weight per side
* Total load (auto)
* Rest time
* Trainer note

User actions:

* ✔️ Completed
* ❌ Skipped
* Add note (pain / heavy / no time)

---

### WORKOUT EXECUTION LOG

* Start Workout → log start time
* End Workout → log end time
* Click DONE → lock workout

---

### POST-WORKOUT ANALYSIS (NO AI COACHING)

Show:

* Completion %
* Skipped exercises
* Total volume lifted
* Cardio done
* Consistency streak

Analysis only.
No advice.

---

### MIDNIGHT RESET

At 12:00 AM local time:

* Day locks
* Missed marked
* Next day auto-loads

---

### FLEXIBLE WORKOUT TIME

User sets preferred workout time:

* Morning
* Evening
* Custom

---

## CARDIO & DAILY MOVEMENT

### Cardio Types

* Walking
* Running
* Cycling
* Swimming
* Skipping
* HIIT

Fields:

* Duration
* Distance (optional)
* Intensity

### Daily Movement

* Steps (manual)
* Active minutes

---

## TRAINER SYSTEM (NO AI)

### TRAINER WEEKLY DESIGN FLOW

Trainer:

1. Selects body part
2. System loads exercise library
3. Trainer sets sets / reps / weight
4. Saves weekly plan

---

### CUSTOM EXERCISES (IMPORTANT)

* Trainer can create custom exercise names
* Saved ONLY for that trainer
* Reusable by same trainer
* Not global

---

### TRAINER NOTES

* Private notes (trainer only)
* Shared notes (user sees)

History preserved forever.

---

### USER FEEDBACK LOOP

User can request:

* Reduce weight
* Modify exercise
* Pain issue
* Equipment issue

Trainer modifies next session.

---

## GYM SYSTEM

### GYM PROFILE

* Facilities
* Trainers
* Classes
* Events
* Images
* Location
* Optional social/pro links
* Ratings (equipment & atmosphere)

---

### GYM VERIFICATION

* Real gym photo
* One ID (owner/manager)
* Verification badge

---

### GYM CONTROLS

* Assign trainers
* View trainer quality analytics
* Create classes/events
* Send announcements

Gym NEVER owns user data.

---

## EVENTS & CLASSES

### EVENTS

* Workshops
* Bootcamps
* Challenges
* Marathons

Fields:

* Date
* Location
* Capacity
* Paid/free

---

### DISCOVERY UX

* Before login: nearby gyms & events
* After login: user data first
* Discovery only on user action

No feed.

---

## NOTIFICATIONS (CORE)

### GYM / TRAINER BROADCAST

* Plain text only
* Category (holiday, class, event, announcement)
* Push + in-app
* Auto-delete after 7 days

---

### BIRTHDAY NOTIFICATION

* Platform sends default birthday message
* Gym / trainer name included
* Personal, non-creepy

---

### WORKOUT REMINDERS

User configurable:

* 2 hrs
* 1 hr
* 30 min
* 15 min

Alarm-style notifications.

---

## ACCESS CONTROL & TRUST

### ACCESS LEVELS (ONLY 3)

1. View
2. Comment
3. Edit

---

### ACCESS LOG

User can see:

* Who accessed data
* When
* Duration

---

## SAFETY SYSTEM

### HOME TRAINING SAFETY (PAID ADD-ON)

Platform does NOT provide home training.

User can enable:

> Verified Home Training Mode

Includes:

* Session check-in / out
* Identity lock
* Session-linked reporting
* Priority moderation
* Pattern detection

Pricing:

* Region-based (₹399 India example)

---

### REPORT CONCERN (QUIET)

* Private
* Session-linked
* Pattern-based escalation

---

## RATINGS SYSTEM

### TRAINER RATINGS

* Behavior
* Knowledge
* Respect
* Safety

Rules:

* ≤2★ → explanation required in 7 days
* No explanation → auto-remove
* No repeat in 30–45 days → decay
* 3 validated incidents → ban

---

### GYM RATINGS

* Equipment
* Cleanliness
* Atmosphere

Simple, public.

---

## PAYMENTS & REFERRALS

### PAYMENTS

* User subscription (region-based)
* Gym subscription
* Safety add-on

### REFERRALS

* Gym: ₹10 per active user/month
* Trainer: 5%
* User: 2.5%
* Referral credits auto-offset subscriptions

---

## TECH REQUIREMENTS

* Mobile-first UI
* Clean, calm design
* No social feed
* No AI coaching yet
* Scalable architecture
* Clear audit logs

---

## FINAL INSTRUCTION

Do NOT simplify.
Do NOT add AI coaching.
Do NOT add social feed.
Do NOT assume gym owns users.

Build this as a **serious, real Fitness Operating System**.




   * “Generate DB schema”
   * “Optimize mobile UX”
   * “Add notification logic”
   * “Add payment plans”

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://fithit.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/505e1830-dea5-4d4c-b3a4-348c704ddfda).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
