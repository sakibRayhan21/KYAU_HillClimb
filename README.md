# 🎓 UNIVERSITY SURVIVAL: 2D Physics Racing Game

A browser-based 2D physics racing game inspired by the legendary mechanics of **Hill Climb Racing**, themed around the thrilling, chaotic, and rewarding journey of a **Computer Science & Engineering (CSE)** student surviving university life at **Khwaja Yunus Ali University (KYAU)**.

Drive your off-road student buggy through 8 distinct semesters, blast university obstacles with your citation blaster, collect academic power, keep your CGPA above water, upgrade your vehicle in the garage, and cross the convocation finish line to graduate!

---

## 🎮 Core Gameplay & Mechanics

### 1. 2D Off-Road Vehicle Physics
- **Realistic Suspension & Hill Climbing:** Powered by **Phaser 3** and **Matter.js** rigid body physics with dual-axle suspension constraints.
- **Air-Balance Controls (Hill Climb Style):**
  - Pressing **Gas / Tilt Up** applies torque to wheels on ground, and tilts vehicle **nose up** while in the air.
  - Pressing **Brake / Tilt Down** slows wheels down, and tilts vehicle **nose down** while in the air to stick smooth landings on mountain slopes.
- **Turbo Nitro Boost:** Activate instant hyper-acceleration with exhaust flame particles to launch over treacherous ravines.

### 2. Fuel & Campus Energy Mechanics
- Fuel gradually depletes as you drive and drains heavily upon impacting obstacles.
- Pick up **Campus Chai & Coffee Thermoses** (+40 Fuel) along the road to avoid breaking down.
- Running out of fuel results in an engine stall and a semester breakdown retry.

### 3. Citation Blaster Weapon System
- Mounted laser cannon on top of the student buggy.
- Fire debug lasers and citations using `Spacebar` or the on-screen **FIRE** button to disintegrate obstacles before collision.
- Synthesize extra ammunition in real-time from your **Academic Power (AP)**.

### 4. 8 University Obstacles
Each obstacle features procedural cartoon graphics, health bars, collision impact, and destruction animations:
1. **Relationship Distraction:** Drains fuel and causes temporary screen/steering flutter (*"We need to talk... ❤️💔"*).
2. **Laziness & Procrastination:** Reduces vehicle speed by 45% for 3 seconds (*"5 more minutes in bed... 🦥"*).
3. **Semester Retake Stamp:** High durability, high impact fuel damage (*Grade: F ❌📄*).
4. **Course Teacher Boss:** Towering faculty boss with red grading pen, maximum HP, and tricky exam hurdles (*"Attendance is mandatory!" 👨‍🏫*).
5. **Social Media Doomscroll:** Smartphone notifications and reels that distract the driver and cut engine speed (*📱🔔*).
6. **Midnight Overthinking:** Inverts or wobbles balance controls for 2.5 seconds (*"What if I fail?!" 🌀🧠*).
7. **11:59 PM Assignment Deadline:** Ticking digital countdown bomb (*⏰💣*).
8. **Attendance Shortage (<75%):** Heavy barrier and academic penalty notice (*🚫📋*).

---

## 📚 Academic Power & CGPA System

### Academic Collectibles
- **Class Test:** `+10 AP`
- **Assignment:** `+15 AP`
- **Quiz:** `+10 AP`
- **Midterm Exam:** `+25 AP`
- **Final Exam:** `+50 AP`
- **Tuition Coins:** `+15 Coins` (Used for vehicle garage upgrades)

### Credit-Weighted CGPA Calculation
- Uses the standard university 4.00 grading scale (A+, A, A-, B+, B, B-, C+, C, D, F).
- Performance is calculated from distance completed, academic items collected, obstacles destroyed, and fuel conserved.
- Generates an **Official Academic Transcript** across all 8 semesters:
  - Total Credits: **140 Credits**
  - Real CSE courses (Data Structures, OOP, Algorithms, Operating Systems, AI, Thesis Defense).
  - Degree honors: *Summa Cum Laude (Chancellor's Gold Medalist)*, *Magna Cum Laude (Dean's Honor List)*, *Cum Laude*, and *Honors*.

---

## 🛠️ Vehicle Garage & Upgrades
Upgrade 6 key vehicle systems up to **Level 10**:
1. **Research Engine & V8 CPU:** Increases top speed and steep hill-climbing torque.
2. **Chai & Coffee Fuel Reservoir:** Expands fuel capacity (up to 240L) and improves burn efficiency.
3. **Adaptive Exam Suspension:** Dampens landing shock, stabilizes roll, and increases tire traction.
4. **Semester Defense Shield:** Reduces fuel damage taken from obstacle collisions down to 30%.
5. **Citation Blaster Cannon:** Increases laser projectile damage, fire rate, and max ammo capacity.
6. **Caffeine Turbo Boost:** Enhances boost speed impulse and reduces cooldown.

---

## 🗺️ The 8 Semesters

| Sem | Title | Theme & Obstacles | Target Distance |
| :--- | :--- | :--- | :--- |
| **01** | First Semester: New University Life | Freshman campus green hills, Laziness, Social Media | 900m |
| **02** | Second Semester: Relationship & Laziness | Romance fog, Hostel naps, Assignment Deadlines | 1100m |
| **03** | Third Semester: Programming Pressure | Data structures cliffs, Overthinking, Retakes | 1300m |
| **04** | Fourth Semester: Midterm & Retake | Exam hall slopes, Retake stamps, Attendance shortage | 1500m |
| **05** | Fifth Semester: Projects & Assignments | Sleepless project sprints, 11:59 PM deadlines | 1700m |
| **06** | Sixth Semester: Course Teacher & Research | Research lab hills, Course Teacher Boss! | 1900m |
| **07** | Seventh Semester: Internship & Career Pressure | Corporate skyscrapers, interview hurdles | 2100m |
| **08** | Eighth Semester: Final Boss & Graduation | Capstone thesis mountain -> Convocation Arch! | 2400m |

---

## ⌨️ Controls

### Desktop Controls:
- **Accelerate / Tilt Nose Up:** `Right Arrow` or `D` or `W` or `Up Arrow`
- **Brake / Reverse / Tilt Nose Down:** `Left Arrow` or `A` or `S` or `Down Arrow`
- **Fire Citation Cannon:** `Spacebar`
- **Turbo Boost:** `Shift`
- **Pause Game:** `Escape` or `P`

### Mobile & Touch Controls:
- On-screen large ergonomic **GAS** and **BRAKE** pedals.
- Dedicated on-screen **FIRE** (laser crosshair) and **BOOST** (flame) buttons.

---

## 🔊 Audio & Visuals
- **Pure Web Audio API Synthesizer:** Dynamic engine pitch modulation that responds to vehicle RPM and acceleration, laser zaps, melodic academic chimes, explosion noise buffers, low fuel alarms, fanfare, and 8-bit university campus BGM. Zero external mp3/wav dependencies so it works completely offline and never fails.
- **Procedural Canvas Art:** Vector cartoon graphics rendered dynamically at boot time in crisp resolution.

---

## 🚀 Running the Project

### Prerequisites:
- Node.js (v18 or higher)
- npm or pnpm

### Development Server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build:
```bash
npm run build
npm run start
```

---

## 💾 Save System
- Automatically persists unlocked semesters, transcript grades, CGPA, coins, academic power, and garage upgrades to `LocalStorage`.
- Supports **Export Save (JSON)** and **Import Save (JSON)** in the Settings menu, along with a confirmed **Reset Progress** option.

