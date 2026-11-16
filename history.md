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
- [x] **Phase 8: Comprehensive Interactive Game Homepage**
  - [x] Created `src/components/HomePage.tsx` with animated procedural canvas physics preview (rolling green hills, bouncing buggy, exhaust flame particles, floating collectibles)
  - [x] Sticky top navigation with KYAU branding, live player stat badges (Sem, CGPA, Coins, AP), sound toggle, settings, and instant "PLAY NOW" launcher
  - [x] Interactive 8-semester curriculum roadmap cards with target distance, course chips, and direct launch buttons
  - [x] Vehicle Garage showcase displaying real-time upgrade level pips for all 6 subsystems
  - [x] Campus Obstacles Bestiary detailing threats, humorous quotes, and counter tactics
  - [x] Controls & Air-Balance Flight School with visual keycaps and pro landing tips
  - [x] UGC Bangladesh 4.00 CGPA grading scale & degree honors reference table
  - [x] Seamless two-way integration with in-game HUD and pause menu ("Exit to Homepage")
- [x] **Phase 9: Student Authentication System & Multi-Profile Support**
  - [x] Built dedicated `/signin` (`/login`) page with Student ID / email credentials, show/hide password toggle, remember-me session persistence, and 1-click Demo Account login
  - [x] Built dedicated `/signup` (`/register`) page with student enrollment form, department selector, starting semester, mascot avatar picker, and guest data migration
  - [x] Created `AuthService` (`src/game/services/authService.ts`) with password hashing, account uniqueness checks, seeded demo CSE cadet account, and session management
  - [x] Integrated `AuthContext` and `useAuth` hook into root layout (`src/app/layout.tsx`)
  - [x] Enhanced `StorageService` to support user-scoped save slots (`university_survival_save_<userId>`), enabling multi-student save isolation on the same browser
  - [x] Added Top Navigation Bar to `HomePage.tsx` with live student profile dropdown, status indicators, and shortcuts to Garage, Transcript, and Settings
  - [x] Integrated student identity badges into `TranscriptModal.tsx`, `GraduationModal.tsx`, `MainMenu.tsx`, and `SettingsModal.tsx`
- [x] **Phase 10: Exclusive KYAU Campus Aerial Background**
  - [x] Set the uploaded KYAU campus aerial photo as the sole background across the entire application (`public/images/kyau_campus_aerial.jpg` & `public/images/background.jpg`)
  - [x] Streamlined `HomePage.tsx` to feature the clean full-screen photo background with subtle ambient embers, completely removing procedural cartoon landscape/mountain/clock tower overlays
  - [x] Streamlined Phaser `GameScene.ts` to use this photo exclusively as the full-screen background behind the hills with dynamic parallax scrolling, removing procedural cartoon clouds and buildings
  - [x] Verified zero-error compilation with `npx tsc --noEmit` and `npm run build` across all pages

---

## 3. Key Decisions & Architecture Log (ADR)

| Date | Topic / Decision | Rationale | Status |
| :--- | :--- | :--- | :--- |
| 2026-11-10 | Phaser 3 + Matter.js | Provides robust rigid body constraints, suspension springs, and compound collisions for Hill Climb vehicles. | Approved |
| 2026-11-10 | Pure Web Audio API | Eliminates external audio file dependencies and 404 risks; supports dynamic engine RPM frequency modulation. | Approved |
| 2026-11-10 | Procedural Vector Textures | Clean cartoon aesthetics rendered at runtime via HTML5 Canvas in `BootScene`; zero missing asset errors. | Approved |
| 2026-11-10 | EventBus Decoupling | Clean separation between Phaser 3 game loop and React 18 / Tailwind UI modals and HUD. | Approved |
| 2026-11-10 | UGC Bangladesh 4.00 Grading Scale | Accurate credit-weighted CGPA computation across 140 CSE credits for authentic academic immersion. | Approved |
| 2026-11-16 | User-Scoped Save Isolation | Isolates progress per user account (`save_<userId>`) while providing seamless guest mode and progress migration upon registration. | Approved |
| 2026-11-16 | Dual Photographic Backgrounds | Incorporates real Khwaja Yunus Ali University photos as interactive home backgrounds and in-game parallax/landmark layers. | Approved |
