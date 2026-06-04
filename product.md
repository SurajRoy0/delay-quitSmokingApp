# Unified Timer System (Core Product Innovation)

## Overview

The application does not have separate "Quit Mode" and "Reduce Mode".

Instead, the application uses a single Smoke-Free Timer as the source of truth and layers the Gap Goal System on top of it.

This creates a unified experience where users can gradually reduce smoking while still benefiting from traditional quit-smoking progress tracking.

The core philosophy is:

"Don't quit forever. Delay the next cigarette."

---

# Core Principle

The entire application revolves around one event:

"I Smoked"

Whenever the user presses:

"I Smoked"

The application:

1. Creates a SmokeLog entry.
2. Resets the Smoke-Free Timer.
3. Resets the Health Recovery Timeline.
4. Starts a new Gap Session.
5. Updates statistics and analytics.
6. Calculates completed challenge blocks.

Everything in the application is derived from the user's last cigarette.

---

# Smoke-Free Timer

This is the primary timer.

It behaves similarly to traditional quit-smoking applications.

Example:

Smoke-Free

05h 32m 18s

The timer starts immediately after the user logs a cigarette.

It continues running until the user logs another cigarette.

This timer powers:

* Health Recovery Milestones
* Money Saved
* Cigarettes Avoided
* Smoke-Free Statistics
* Personal Records
* Gap Progress

The Smoke-Free Timer is the single source of truth.

---

# Gap Goal System

The Gap Goal System is a motivational layer built on top of the Smoke-Free Timer.

Users define a target gap.

Examples:

* 30 Minutes
* 1 Hour
* 2 Hours
* 4 Hours
* 8 Hours
* Custom

Example:

Target Gap = 4 Hours

The application compares the current Smoke-Free Timer against the selected target.

---

# Example User Flow

## 10:00 AM

User smokes.

User presses:

"I Smoked"

Application State:

Smoke-Free Timer:
00:00:00

Target Gap:
04:00:00

Progress:
0%

---

## 12:00 PM

Application State:

Smoke-Free Timer:
02:00:00

Target Gap:
04:00:00

Progress:
50%

Remaining:
02:00:00

---

## 02:00 PM

Target Gap Completed

Application State:

Smoke-Free Timer:
04:00:00

Target Gap:
Completed ✓

The user has successfully completed their first challenge.

The Smoke-Free Timer continues running.

The user now enters Progressive Challenge Mode.

---

# Progressive Challenge Mode

Once the target gap is completed, the application automatically creates additional challenge blocks.

Each challenge block equals 25% of the original target gap.

Formula:

Challenge Block = Target Gap × 25%

Example:

Target Gap:
04:00:00

Challenge Block:
01:00:00

The application continuously generates additional 1-hour challenges until the user smokes.

The challenges never stop.

The user is always chasing the next milestone.

---

# Example

Target Gap:

04:00:00

Challenge Block:

01:00:00

---

## 02:00 PM

Completed:

✓ 04:00:00

---

## 03:00 PM

Completed:

✓ 04:00:00

✓ 01:00:00

---

## 04:00 PM

Completed:

✓ 04:00:00

✓ 01:00:00

✓ 01:00:00

---

## 04:47 PM

Current State:

Completed Challenges:

✓ 04:00:00

✓ 01:00:00

✓ 01:00:00

Current Challenge:

00:47:54 / 01:00:00

Current Smoke-Free Time:

06:47:54

---

# Challenge Stack Visualization

The dashboard should visually show every completed block.

Example:

Completed Challenges

✓ 04:00:00

✓ 01:00:00

✓ 01:00:00

✓ 01:00:00

Current Challenge

00:47:54 / 01:00:00

This creates a feeling of stacking victories.

The user continuously earns wins instead of staring at a single timer.

---

# Why This Works

Traditional quit-smoking applications only show:

Smoke-Free:
06:47:54

This creates a passive experience.

Delay additionally shows:

Completed Challenges:

✓ 04:00:00

✓ 01:00:00

✓ 01:00:00

Current Challenge:

00:47:54 / 01:00:00

The user sees a series of accomplishments.

Every completed challenge creates positive reinforcement.

The user is repeatedly rewarded for delaying.

---

# Smoking Confirmation Flow

When the user presses:

"I Smoked"

The application should not immediately reset progress.

Instead show a confirmation modal.

---

# Confirmation Modal

Title:

Did you smoke a cigarette?

Message:

If you haven't smoked yet, try waiting a little longer.

You have already completed several challenges and every extra minute counts.

If you did smoke, that's completely okay.

You have already made meaningful progress.

Buttons:

Keep Going

I Smoked

---

# Keep Going

If the user selects:

Keep Going

The modal closes.

No data changes.

The Smoke-Free Timer continues.

The challenge continues.

---

# Confirm Smoking

If the user selects:

I Smoked

The application:

1. Creates SmokeLog
2. Saves smoking reason
3. Calculates total session duration
4. Updates personal records
5. Updates analytics
6. Starts a new session

---

# Session Completion Screen

Before resetting to the new session, show the user what they achieved.

Example:

Session Completed

Total Smoke-Free Time

06:47:54

Completed Challenges

✓ 04:00:00

✓ 01:00:00

✓ 01:00:00

Current Challenge Progress

00:47:54 / 01:00:00

Longest Gap Ever

11:24:00

Message:

Great job.

You delayed smoking for nearly 7 hours.

Every delay matters.

Let's try to beat this next time.

Button:

Start New Session

Only after pressing this button does the dashboard reset.

---

# Longest Gap Ever

The application permanently tracks the user's best performance.

Example:

Longest Gap Ever

11h 24m

This value never resets.

Even if the user smokes.

Purpose:

Allow users to build long-term confidence.

The application celebrates progress, not perfection.

---

# Key Difference From Existing Apps

Traditional Apps:

"How long since you quit?"

Delay:

"How long can you delay the next cigarette?"

Traditional Apps reward abstinence.

Delay rewards progress.

Traditional Apps punish relapse.

Delay celebrates every successful delay.

The user is never judged for smoking.

The user is rewarded for waiting longer than before.

This is the core behavioral principle of the product.
