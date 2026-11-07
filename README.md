# Hemabridge

> **"Every donor is a hope for someone's next breath"**  
> A 3-in-1 digital blood donor matchmaking platform, humanitarian movement, and B2B hospital connectivity system built specifically for emergency healthcare mobilization in Nigeria.

---

## 🩸 Project Overview

Hemabridge bridges the life-or-death gap in Nigeria between distressed patients urgently needing blood during medical emergencies and available, compatible, medically eligible voluntary donors.

### Key Solved Problems
1. **Eliminates Chaos of WhatsApp Appeals**: Replaces frantic, unstructured broadcast chains with an automated, location-aware, privacy-preserving matchmaking network.
2. **Real-Time Availability vs. Stale Databases**: Solves the inactive database trap by enforcing dynamic availability switches and automatic cooldown timers (3 months for males, 4 months for females).
3. **Institutional Partnering**: Integrates accredited healthcare facilities (e.g., LUTH, LASUTH, FMC Ebute Metta, Reddington) that conduct clinical screening, haemoglobin verification, and blood compatibility testing.
4. **Distressed Patients Never Pay**: Ethical revenue model where patients/victims are never charged. Revenue comes from hospital subscriptions, corporate donor-welfare sponsorships, and healthcare CSR campaigns.
5. **Real-Time Cross-Role Chat**: Direct in-app communication between Voluntary Donors, Patient Advocates, and Hospital Clinical Teams.
6. **Vein of Hope Honours**: Gamified recognition, digital achievement badges, and donation milestone verification.

---

## 🏗️ Architecture & Technology Stack

### Backend (`/backend`)
* **Framework**: NestJS (Monolithic modular architecture)
* **ORM**: TypeORM with PostgreSQL driver (`pg`)
* **Database**: Neon PostgreSQL cloud database support with SSL configuration
* **Real-Time Communication**: NestJS WebSockets with Socket.io Gateway
* **Security**: JWT authentication, bcryptjs password hashing, role-based guards (`DONOR`, `ADVOCATE`, `HOSPITAL`)
* **Data Seeder**: Pre-populates realistic Nigerian dummy users, hospitals, requests, and active chat threads on startup

### Mobile Application (`/mobile`)
* **Framework**: React Native with Expo SDK 51
* **Styling**: NativeWind (Tailwind CSS for React Native)
* **Iconography**: `iconnoir-react-native` with `react-native-svg`
* **Navigation**: React Navigation (Bottom Tabs + Native Stack) with dynamic role adaptation
* **Real-Time Chat**: Bidirectional Socket.io client with REST fallback, message bubbles, read receipts, and quick medical prompts
* **Role Switcher**: One-tap perspective switcher to instantly test Donor, Advocate, and Hospital workflows

---

## 👥 Seeded Test Accounts (1-2 Users per Role)

All seeded test accounts use the password: `Password123!`

| Role | Name | Email | Details |
| :--- | :--- | :--- | :--- |
| **Donor (Female)** | Amara Miller | `amara.miller@hemabridge.com` | Blood Group **O+** • Ikeja, Lagos • Available • Vein of Hope Honoured |
| **Donor (Male)** | Chidi Okafor | `chidi.okafor@hemabridge.com` | Blood Group **A+** • Yaba, Lagos • Available • 2 Badges Earned |
| **Patient Advocate** | Bolanle Adebayo | `bolanle.advocate@hemabridge.com` | Patient relative at LUTH requesting O+ replacement blood |
| **Patient Advocate** | Emeka Nwosu | `emeka.advocate@hemabridge.com` | Emergency advocate at LASUTH requesting A+ blood |
| **Hospital** | LUTH | `luth@hemabridge.com` | Lagos University Teaching Hospital • Desk: Open • Shortages: O+, O-, A- |
| **Hospital** | Reddington Hospital | `reddington@hemabridge.com` | Victoria Island • Desk: Open • Shortages: O+, A+, AB+ |

---

## 💬 Real-Time Chat Feature

The in-app chat connects donors directly with both consumers:
1. **Donor & Patient Advocate**: Coordinate hospital meeting points, urgency levels, and direct patient support.
2. **Donor & Hospital**: Clinical team schedules screening appointments, lab directions, and pre-donation preparation instructions.

### Features
* Low-latency bidirectional WebSocket messaging (`ChatGateway`).
* Delivery timestamps and double check read receipts.
* Healthcare quick prompts (e.g. *"Drink plenty of water before coming"*, *"Please report to Haematology Lab 2nd floor"*).
* Unread badge indicators across navigation tabs.

---

## 🚀 Getting Started

### 1. Backend Configuration

1. Open `backend/.env`.
2. Add your **Neon PostgreSQL** database string:
   ```env
   DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require
   PORT=4000
   JWT_SECRET=hemabridge_super_secure_jwt_secret_2026_nigeria_blood_emergency
   ```
3. Run the backend:
   ```bash
   cd backend
   npm run start:dev
   ```
   *The backend will automatically synchronize database tables and seed test accounts on boot.*

### 2. Mobile App Setup

1. Open a new terminal:
   ```bash
   cd mobile
   npm install
   npm start
   ```
2. Scan the QR code using Expo Go on your mobile device or run in web/emulator.

---

## 🔒 Security & Git Hygiene
The root `.gitignore` is pre-configured to strictly exclude sensitive `.env` files, node_modules, build outputs, and local AI customization tools.
