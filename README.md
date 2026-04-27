# CareRoute | ASHA Supervisor Dashboard 🩺

A real-time, AI-integrated health management dashboard designed to empower ASHA (Accredited Social Health Activists) supervisors. This platform enables regional health monitoring, patient prioritization, and AI-driven clinical insights.

## The Solution
This dashboard addresses the "Human-in-the-loop" challenge in community health. It allows supervisors to:
- **Monitor Multiple Regions:** Unified view of health workers across regions (A1-A6).
- **Geospatial Mapping:** Integrated map view for every patient list to visualize health coverage in real-time.
- **Smart Patient Roster:** Instant search and filtering by name, condition, or critical status.
- **AI-Driven Insights:** Review AI-generated checklists and status reports for each patient.

## Tech Stack
- **Frontend:** React.js / Vite
- **Database:** Google Firebase (Cloud Firestore)
- **State Management:** React Hooks
- **Styling:** Modern CSS-in-JS

## Features
- **Real-time Sync:** Powered by Firestore `onSnapshot` for live data updates.
- **Advanced Search:** Multi-parameter search across 60+ patient records.
- **Regional Scaling:** Dynamic routing for infinite scalability of health worker zones.

## Setup & Installation
1. **Clone the repository:**
   ```bash
    git clone [your-repo-link]

2. Install dependencies:
   ```Bash
    npm install

3. Configure Firebase:
   Update your credentials in src/firebase.js.

4. Run the development server:
   ```Bash
    npm run dev

### Built for the Google Solution Challenge 2026.
