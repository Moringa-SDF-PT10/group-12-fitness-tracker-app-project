# FitMate: Your Personal Fitness Tracking Companion 🏋️‍♀️📊
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/built%20with-React-61DAFB?logo=react)
![Anime.js](https://img.shields.io/badge/animation-Anime.js-ff69b4)
![Status](https://img.shields.io/badge/status-active-brightgreen)

Fit-Mate is an interactive and dynamic React fitness tracking application designed to help you manage your workouts, monitor progress, and achieve your fitness goals. It features a clean, responsive UI with engaging animations and a personalized experience.

---

## ✨ Features

* **🔐 Mock Authentication**: User-friendly Login, Register, Forgot/Reset Password flows with session persistence using `localStorage`.
* **🏋️ Extensive Workout Library**: Browse a comprehensive list of exercises with detailed information, fetched from the ExerciseDB API. Filter workouts by name, body part, or equipment.
* **📊 Personalized & Editable Dashboard**:
    * Track and edit your **Weekly Activity Goals** (total minutes, number of sessions by type, body part focus).
    * Monitor and update **Daily Habits** like water intake and sleep hours against your set goals.
    * Visualize **Daily Activity Progress** with interactive rings for each day of the week, showing minutes and completed sessions.
    * View completed and upcoming logged workouts.
* **👤 Profile & Settings Management**:
    * Create and manage your user profile (initial data mocked via JSONPlaceholder API).
    * Customize application preferences, including light/dark themes.
    * All user-specific data (profile, settings, dashboard goals & progress) is persisted locally.
* **🎨 Responsive & Modern UI**:
    * Clean, Material You-inspired design built with Tailwind CSS.
    * Smooth UI animations powered by Anime.js.
    * Crisp and scalable icons from Lucide Icons.
    * Fully responsive for optimal viewing on mobile, tablet, and desktop.
* **🔄 Data Persistence**: Uses `localStorage` for mock auth, user profiles, custom settings, and all dashboard data, ensuring your information is saved between sessions.
* **🔧 API Integration**: Fetches workout data from ExerciseDB and uses JSONPlaceholder for mock profile creation. Supports API interactions for saving edited exercise details (demonstrative `PATCH` request).

---

## 🧰 Tech Stack

* ⚛️ **React + Vite**
* 🎨 **Tailwind CSS**
* 🌀 **Anime.js**
* 🎯 **Lucide React** 
* 🔗 **APIs**:
    * [ExerciseDB API](https://exercisedb-api.vercel.app/api/v1/exercises) – For fetching workout data.
    * [JSONPlaceholder API](https://jsonplaceholder.typicode.com/posts) – For mock user profile creation.
* 💾 **LocalStorage** – For client-side data persistence (auth, profile, settings, dashboard).

---

## 🎬 Demo Preview

🔗 **Live Demo**: [Fit-Mate](https://fit-mate.netlify.app/)

---

## 📂 Project Structure

```
fitmate-app/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   ├── components/
│   │   └── common/
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── ResetPasswordPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── WorkoutsPage.jsx
│   │   ├── WorkoutDetailPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── SettingsPage.jsx
│   ├── App.css
│   ├── index.css
│   ├── Styles.css
│   ├── App.jsx
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

---

## 🚀 Getting Started

To get a local copy of FitMate up and running, follow these steps:

### 1. Clone the Repository

```bash
git clone git@github.com:Moringa-SDF-PT10/group-12-fitness-tracker-app-project.git
```

### 2. Navigate to the Project Folder

```bash
cd group-12-fitness-tracker-app-project
```

### 3. Install Dependencies

Make sure you have **Node.js** and **npm** installed. Then run:

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🙌 Contributing

### 1. Fork the Repository

Click the **“Fork”** button on GitHub.

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes

### 4. Commit Your Changes

```bash
git commit -m "feat: Add awesome feature"
```

### 5. Push to Your Branch

```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

Open a PR from your forked repo to the main branch.

---

## 🤝 Contributors

This project was a collaborative effort by the following amazing developers:

* 👤 **[Antony Milimo](https://github.com/ANTONMILIMO)** - antonmilimo
* 👤 **[George Kahuki](https://github.com/GKahuki)** - GKahuki
* 👤 **[Ike Mwithiga](https://github.com/Thigzz)** - Thigzz

A big thank you to everyone for their hard work and dedication!

## 📄 License

Licensed under the **MIT License**.

---

## 💪 Happy Tracking & Stay Fit!

Built with React, and a sprinkle of animation magic ✨
