# Shurangan — A Cultural Academy

This is the original Shurangan frontend design, extended with role-based authentication and dashboards.

## Built with
- HTML
- Tailwind CSS CDN
- Custom CSS
- Vanilla JavaScript

## Run
Open `index.html` in a browser, or use VS Code Live Server.

## Included
- Original Shurangan landing page design
- Bangladeshi cultural content using English UI only
- Rabindra Sangeet, Nazrul Geeti, Bengali folk music and dance
- Login + Sign Up
- Role selection: Student, Teacher, System Admin
- Automatic role-specific dashboard after login/signup
- Student: Overview, Attendance, Exams & Results, Payments, Profile
- Teacher: Overview, My Batches, Student Attendance, Classes & Schedule, Profile
- System Admin: Overview, User Management, Programs & Batches, Payments & Reports, System Settings
- Demo authentication using localStorage

## Demo accounts

Student:
`student@shurangan.bd` / `123456`

Teacher:
`teacher@shurangan.bd` / `123456`

System Admin:
`admin@shurangan.bd` / `123456`

## Important
Authentication is currently a frontend prototype using `localStorage`. For the final project, replace it with backend authentication connected to the Oracle database and the ER/schema designed for Shurangan.
