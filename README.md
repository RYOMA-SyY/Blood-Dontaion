THE BOTTOM FRAGS - Blood Donation Platform

Overview:
A full-stack web application designed to encourage, track, and reward blood donations by building a community of donors through gamification, real-time leaderboards, and personalized profiles.

Key Features:
- User Authentication & Profile Management: Secure sign‑up/log‑in with JWT, profile creation, and avatar support.
- Donation Tracking: Record donation events, volumes, dates, and calculate LifePoints.
- Gamified Ranking & LifePoints System: Eight donor ranks (Iron to Immortal) based on accumulated points.
- Dynamic Leaderboard: View top donors by all-time or event-specific metrics with animated updates.
- Scheduling Support: Display next eligible donation date per user.
- Responsive UI: Static frontend pages (home, sign‑in, profile, leaderboard) built with HTML, CSS & JavaScript.

Ranking & Emotional Motivation:
- Moroccan Ambition: Inspired by Morocco’s spirit of solidarity and resilience, the platform channels collective emotion to foster driven participation and community pride.

LifePoints System Details:
- Earning Points: Users earn LifePoints proportional to donation volume (e.g., 500ml = 50 points) with frequency bonuses for repeat donors.
- Tracking & Transparency: Real‑time display of total points, donation history, and countdown to next eligible date with animated feedback.
- Rewards & Recognition: Points unlock badges, exclusive events, special profile themes, and social leaderboards.

Gamified Donor Ranks Deep Dive:
- Iron Donor (0–49): Beginning your journey — every drop matters.
- Bronze Donor (50–99): Demonstrating commitment and building momentum.
- Silver Donor (100–199): Consistent lifesaver — a trusted contributor.
- Gold Donor (200–349): Reliable hero — key community pillar.
- Platinum Donor (350–499): Elevated impact and recognition.
- Diamond Donor (500–749): Exceptional generosity and influence.
- Crimson Donor (750–999): Passionate leader inspiring peers.
- Immortal Donor (1000+): Legendary status — a model of lifelong giving.

Tech Stack:
- Frontend: HTML5, CSS3, Vanilla JavaScript
- Backend: Node.js, Express.js
- Database: SQLite (file-based)
- Authentication: JSON Web Tokens (JWT)

Architecture & Project Structure:
.
├── back/
│   ├── app.js           — Entry point, Express server configuration
│   ├── routes/          — API endpoints (leaderboard, user profiles)
│   ├── db.js            — SQLite connection and schema initialization
│   ├── middleware/      — Authentication & logging
│   └── data/            — Persistent storage
├── docs/                — Static HTML documentation (home, sign‑in, profile, leaderboard)
├── readme/              — Project README with setup & system overview
├── description.txt      — (This document)
├── package.json         — Backend dependencies and scripts
└── ...                  — Other config and asset files

Database Schema:
- users: id, name, email, blood_type, avatar, total_points, donation_count
- donations: id, user_id, date, volume, points_awarded

API Endpoints:
- GET /api/user/:id        — Fetch user profile and donation stats
- GET /api/leaderboard     — Retrieve top donors list
- POST /api/donate         — Record a new donation and award points

Setup & Running:
1. Clone repository & navigate to project root.
2. cd back && npm install
3. Copy .env.example to .env and configure variables.
4. npm start — Launch server on default port.
5. Use docs/home.html or navigate to server URL for the UI.

Contributing:
Refer to readme/README.md for forking, branching, and PR guidelines.

License:
ISC License — See LICENSE file for full terms.



Extra :

🩸 Donor Rank Tiers (Updated)
1 ) Iron Donor

0–49 LifePoints

Just getting started. Every drop makes a difference.

2 ) Bronze Donor

50–99 LifePoints
New but committed. Thank you for joining the cause.

3 ) Silver Donor

100–199 LifePoints
You're on your way to becoming a lifesaver.

4 ) Gold Donor

200–349 LifePoints
Reliable, steady, and saving lives.

5 ) Platinum Donor

350–499 LifePoints
A trusted hero in the donation community.

6 ) Diamond Donor

500–749 LifePoints
Rare, consistent, and deeply valued.

7 ) Crimson Donor 🔴 (New — replaces Ascendant)

750–999 LifePoints
Symbol of passion and power. A true life warrior.

8 ) Immortal Donor

1000+ LifePoints
Legendary impact. Your donations echo forever.