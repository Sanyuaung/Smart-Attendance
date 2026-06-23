# 🌌 Smart Attendance & Astronomical Ambient Dashboard

A highly polished, responsive full-stack frontend application built with **React**, **Vite**, and **Tailwind CSS**. This dashboard combines modern, high-precision team attendance logging with an ambient, nature-inspired visual theme that adapts to real-time **astronomical moon phases** and **local climate conditions**.

---

## ✨ Features

- **⏱️ Attendance Control**: Log daily shifts, review summarized metrics, and browse chronological check-in histories in one clean workspace.
- **🌍 Weather & Localized Geocoding**: Real-time weather forecasting integrated with automated geocoding using dual-provider fallbacks (BigDataCloud & OpenStreetMap Nominatim).
- **🌘 Ambient Theme Engine**: A dynamic backdrop that shifts based on the actual physical lunar cycle.
- **⚙️ Deep Visual Customization**: Personalize interactive variables like button audio feedback, ripple wave durations, and custom particle flow vectors in Settings.
- **🚀 CI/CD Pipeline Ready**: Automated GitHub Actions workflow configured to compile production bundles and safely push them to AWS S3 & CloudFront.

---

## 📐 Developer Math & Core Algorithms

To keep our custom visual animations lightweight and natural, the dashboard implements several fundamental mathematical calculations under the hood:

### 1. Astronomical Moon Phase Tracking
Our Lunar Age model converts calendar dates to Julian Dates (JD) to remain robust across timezones, leap years, and centuries.

*   **Formula**:
    $$\text{Julian Date (JD)} = \frac{\text{Milliseconds Since 1970}}{86,400,000} + 2440587.5$$
    $$\text{Days Elapsed} = \text{JD} - \text{JD}_{\text{NewMoon Landmark (Jan 6, 2000)}}$$
    $$\text{Lunar Age} = \text{Days Elapsed} \pmod{29.53058867}$$
    $$\text{Phase Index} = \text{round}\left(\frac{\text{Lunar Age}}{29.53058867} \times 8\right) \pmod{8}$$

*   **Concrete Code Example (June 23, 2026)**:
    - Target Date JD: `2,461,214.58`
    - Landmark New Moon Epoch JD: `2,451,550.1` (Jan 6, 2000)
    - Days Elapsed: `9,664.48 days`
    - Remaining Phase Cycle Offset: `9,664.48 % 29.53059` = **`7.15 days`** (The Moon's current Age)
    - Mapping to Phase Grid: `(7.15 / 29.53059) * 8` = `1.93` $\approx$ **Index 2 (🌓 First Quarter Moon)**

---

### 2. Timed Circle Ripple Waves
Expanding concentric rings behind the main action button scale outward with timed delay offsets so they never expand concurrently.

*   **Formula**:
    $$\text{Animation Start Delay} = \text{Ring Index} \times 0.25\text{ seconds}$$
*   **Timing Sample**:
    - **Ring 1 (Inner)**: `0.00s delay` (Expands instantly)
    - **Ring 2 (Middle)**: `0.25s delay` (Begins 250ms later)
    - **Ring 3 (Outer)**: `0.50s delay` (Begins 500ms later)
    - *Result*: Smooth, organic, liquid waves pulsating cleanly within your configured settings duration.

---

### 3. Trigonometric Particle Explode Vectors
For celebration bursts upon check-in, shimmers are distributed evenly across a full circular coordinate grid using trigonometry.

*   **Formula**:
    Choose a random angle $\theta \in [0, 2\pi]$ and velocity $v$:
    $$v_x = v \times \cos(\theta)$$
    $$v_y = v \times \sin(\theta)$$
*   **Flow Motion Options**:
    - **Explode**: Moves diagonal vectors outwards symmetrically ($\theta \in [0, 2\pi]$) to resemble micro-fireworks.
    - **Rising**: Restricts the horizontal vector and applies negative vertical coordinates to float upwards like sky lanterns.
    - **Falling**: Simulates atmospheric gravity drag, pulling shimmers downward like festive rain.

---

## 🛠️ Project Structure

```bash
/src
 ├── assets/        # Ambient illustration assets and icons
 ├── components/    # Reusable dashboard cards, settings modules, and modals
 │    ├── AttendanceHistory.tsx  # Chronological check-in register
 │    ├── DailyStatus.tsx        # Shifts log and duration counters
 │    ├── GuideModal.tsx         # In-app help, features, and calculations guide
 │    ├── LocationWidget.tsx     # Location detection & geocoding interface
 │    ├── RealisticMoon.tsx      # SVG Lunar phase renderer
 │    └── WeatherWidget.tsx      # Dynamic weather forecasting card
 ├── hooks/         # Custom state modules
 │    ├── useThemeEngine.ts      # Tracks current time and moon states
 │    └── useWeatherLocation.ts  # Weather & reverse geocoding fetchers
 ├── store/         # Shared state managers (Zustand/local storage)
 └── types.ts       # Shared TypeScript types & interfaces
```

---

## 💻 Local Setup & Development

First, ensure you have **Node.js (v20+)** installed on your system.

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev Server
Spin up the local environment (configured to bind safely to port `3000`):
```bash
npm run dev
```

### 3. Build & Compile for Production
Generates optimized static assets inside the `dist/` directory:
```bash
npm run build
```

---

## 🚀 CI/CD Pipeline (GitHub Actions)

Any commit pushed to the `main` branch automatically triggers our deployment workflow configured in `.github/workflows/deploy.yml`:

1. **Security**: Uses OpenID Connect (OIDC) to safely assume the AWS Identity role (`AWS_ROLE_ARN`) without hardcoded access keys.
2. **Sync**: Syncs the compiled `/dist` bundle directly to our public S3 bucket (`s3://smart-attendance-rd`) and deletes obsolete files.
3. **Purge**: Runs an invalidation path (`/*`) against our Amazon CloudFront CDN (`E1NSB8GRYXNCM7`) to guarantee immediate client updates.
