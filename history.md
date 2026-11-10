# Project History & Progress Tracker

> **Project Name:** UNIVERSITY SURVIVAL (Hill Climb CSE Edition)  
> **Created Date:** 2026-11-10  
> **Status:** Completed & Production Verified  

---

## 1. Project Overview
A complete, polished, browser-based 2D physics racing game called **UNIVERSITY SURVIVAL**, inspired by the gameplay mechanics of Hill Climb Racing, featuring an original university-life theme (Khwaja Yunus Ali University / KYAU CSE inspiration), procedural cartoon vector artwork, 8 university obstacle types, academic collectibles, CGPA calculation engine, vehicle garage upgrades, and persistent progression.

---

## 2. Milestones & Roadmap

- [x] **Phase 1: Project Architecture & Environment**
  - [x] Initialized Next.js 14 + TypeScript + Tailwind CSS
  - [x] Modular directory structure (`src/game/`, `src/components/`, `src/app/`)
  - [x] Centralized configs (`gameConfig.ts`, `semestersConfig.ts`, `upgradesConfig.ts`)
- [x] **Phase 2: Game Engine & Physics**
  - [x] Phaser 3 + Matter.js 2D rigid vehicle physics (chassis, wheels, dual suspension constraints)
  - [x] Smooth sine-wave terrain generation with physics collision segments
  - [x] Dual-air balance mechanics (Gas tilts nose up, Brake tilts nose down)
  - [x] Turbo Nitro boost & camera tracking
- [x] **Phase 3: University Themes, Obstacles & Combat**
  - [x] Procedural canvas vector textures (zero external 404 dependencies)
  - [x] 8 University obstacles (Relationship, Laziness, Retake, Course Teacher Boss, Social Media, Overthinking, Assignment Deadline, Attendance Shortage)
  - [x] Citation Blaster weapon system with laser projectiles and particle explosions
  - [x] Fuel consumption, low fuel alarms, and Chai coffee refills
- [x] **Phase 4: Academic Power & CGPA Engine**
  - [x] Collectibles: Class Test (+10 AP), Assignment (+15 AP), Quiz (+10 AP), Midterm (+25 AP), Final Exam (+50 AP), Coins (+15)
  - [x] Credit-weighted Semester GPA & Cumulative CGPA calculation engine
  - [x] Official 8-semester course curriculum based on Computer Science & Engineering (140 credits)
- [x] **Phase 5: Vehicle Garage & Upgrades**
  - [x] 6 Upgradable Systems (Engine, Fuel Tank, Suspension, Armor, Weapon, Turbo)
  - [x] 10 levels per upgrade with real-time stats and visual pip meters
  - [x] Dual currency economy (Tuition Coins + Academic Power)
- [x] **Phase 6: UI/UX, Audio & Persistence**
  - [x] Web Audio API procedural sound synthesizer (Engine pitch, laser, chimes, explosions, BGM)
  - [x] Responsive desktop keyboard + mobile touch overlay
  - [x] Modals: Main Menu, HUD, Garage, Semester Select, Transcript, Semester Results, Game Over, Pause, Settings, How to Play, Graduation Ceremony
  - [x] LocalStorage save system with JSON export/import and reset
- [x] **Phase 7: Build & Production Verification**
  - [x] `npm run build` succeeds with zero errors
  - [x] Production server verified with live HTTP request probe

---

## 3. Key Decisions & Architecture Log (ADR)

| Date | Topic / Decision | Rationale | Status |
| :--- | :--- | :--- | :--- |
| 2026-11-10 | Phaser 3 + Matter.js | Provides robust rigid body constraints, suspension springs, and compound collisions for Hill Climb vehicles. | Approved |
| 2026-11-10 | Pure Web Audio API | Eliminates external audio file dependencies and 404 risks; supports dynamic engine RPM frequency modulation. | Approved |
| 2026-11-10 | Procedural Vector Textures | Clean cartoon aesthetics rendered at runtime via HTML5 Canvas in `BootScene`; zero missing asset errors. | Approved |
| 2026-11-10 | EventBus Decoupling | Clean separation between Phaser 3 game loop and React 18 / Tailwind UI modals and HUD. | Approved |
| 2026-11-10 | UGC Bangladesh 4.00 Grading Scale | Accurate credit-weighted CGPA computation across 140 CSE credits for authentic academic immersion. | Approved |
