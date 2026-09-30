# Aqua Trust 💧

> **"Monitor. Understand. Protect."**

Aqua Trust is an intelligent water monitoring and analytics platform. Built for a safer future, the platform transforms raw environmental sensor data into actionable water intelligence. It provides real-time monitoring, AI-driven insights, anomaly detection, and citizen reporting all from a premium, enterprise-grade interface.

![Aqua Trust Platform](./frontend/src/assets/react.svg) <!-- Replace with actual screenshot when available -->

## 🌟 Key Features

* **Real-time Monitoring Dashboard**: Monitor critical metrics (pH, Turbidity, Temperature, DO) via live gauges and KPI charts.
* **Aqua Score**: A composite algorithmic water quality score analyzing physical, chemical, and biological dimensions.
* **Interactive Water Map**: Geographic visualization of monitoring zones using `react-leaflet`, with color-coded safety statuses.
* **Aqua Intelligence**: An AI interpretation engine that converts raw data into plain English (e.g., Algal Bloom Predictions, Turbidity spikes) using intelligent confidence scores.
* **Sensor Management**: Monitor sensor connectivity, battery levels, signal strength, and hardware calibration.
* **Citizen Reporting**: A sleek portal for the public to report visual pollution, strange odors, or wildlife issues.
* **Automated Reporting**: Downloadable daily, weekly, and monthly PDF/CSV water quality summaries.

## 🏗️ Architecture Stack

**Frontend** (Premium UI / Analytics)
* React 19 + TypeScript
* Vite (Build Tool)
* Tailwind CSS v4 (Glassmorphism Design System)
* Recharts (Data Visualization)
* React-Leaflet (Interactive Mapping)
* Lucide React (Iconography)

**Backend** (API & Data Abstraction)
* Node.js + Express
* TypeScript
* MongoDB (via Mongoose)
* REST API Architecture

## 🚀 Getting Started

To run the platform locally, you will need to run the Frontend UI and Backend API concurrently.

### Prerequisites
* Node.js (v18 or higher)
* MongoDB (Running locally on default port 27017 or a cloud URI)

### 1. Start the Backend API
The backend acts as a data layer that ingests IoT hardware readings.
```bash
cd backend
npm install

# Start the server (runs on http://localhost:5000)
npm run dev
```
*(Note: If MongoDB is not running locally, the server will gracefully fail-open and serve mock data so you can still test the UI).*

### 2. Start the Frontend UI
The frontend delivers the real-time analytics dashboard.
```bash
cd frontend
npm install

# Start the development server (runs on http://localhost:5173)
npm run dev
```

## 📂 Project Structure

```
Aqua-Trust/
├── frontend/                  # React Application
│   ├── src/
│   │   ├── components/        # Reusable UI widgets (Charts, Maps)
│   │   ├── pages/             # Major dashboard views (Admin, Intelligence, etc.)
│   │   └── App.tsx            # Main router
│   └── index.css              # Tailwind global design system
│
└── backend/                   # Node.js Express API
    ├── src/
    │   ├── models/            # Mongoose MongoDB schemas (Sensor, Reading, User)
    │   ├── routes/            # API endpoint definitions
    │   └── index.ts           # Server entry point
    └── tsconfig.json          # Backend TypeScript configuration
```

## 🤝 Contributing

Contributions are welcome! This platform is designed to be highly modular so different teams can easily plug in physical IoT sensors (Arduino/ESP32) into the backend `/api/readings` endpoint via MQTT or HTTP.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is for educational and environmental demonstration purposes.

---
*Built with care for a safer environmental future.*