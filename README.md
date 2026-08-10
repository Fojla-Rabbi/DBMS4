# Shurangan — A Cultural Academy

Updated frontend preserving the original wine / burgundy / gold design and overall homepage layout.

## Cultural Academy Content
- Rabindra Sangeet
- Nazrul Geeti
- Bangladeshi Folk Music
- Bangladeshi Folk & Classical Dance
- Recitation & Theatre
- Visual Arts

## Authentication Flow
**Sign Up → Select Role → Create Account → Login → Automatic Dashboard**

Roles:
- Student
- Teacher
- System Admin

Demo accounts are stored in the browser's localStorage. This is frontend-only and can be replaced with the Oracle/API authentication later.

## Role Dashboards

### Student
- Overview
- Attendance
- Exams & Results
- Payments
- Profile

### Teacher
- Overview
- My Batches
- Student Attendance
- Classes & Schedule
- Profile

### System Admin
- Overview
- User Management
- Programs & Batches
- Payments & Reports
- System Settings

## Run
Open `index.html` directly in a browser, or use VS Code Live Server.

## Files
- `index.html` — homepage, authentication UI and dashboards
- `styles.css` — original styling plus responsive dashboard/auth styles
- `app.js` — navigation, authentication demo, role dashboards, toast messages
