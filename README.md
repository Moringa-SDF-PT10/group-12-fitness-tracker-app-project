# Fit Mate
This group project is an interactive fitness tracking APP built with React. 

## Summary
The APP features:
 - Mock authentication.
 - Detailed browsing through the available workouts.
 - A personalized dashboard for tracking your progress.
 - Profile management.
 - A responsive UI with dark/light themes according to the user preference.

 ## APIs used
 - [ExerciseDB API](https://exercisedb-api.vercel.app/api/v1/exercises)
 - [JSONPlaceholder API](https://jsonplaceholder.typicode.com/posts)

## 🗂️ Folder Structure

    fitbuddy-app/
    ├── public/
    │   └── favicon       
    ├── src/
    │   ├── components/
    │   │   └── common/
    │   │       ├── Navbar.jsx
    │   │       └── Footer.jsx
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
    │   │   ├── SettingsPage.jsx
    │   │   └── NotFoundPage.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .gitignore
    ├── index.html
    ├── package.json
    └── vite.config.js

## 🛠️ Tech Stack
- React + Vite – Frontend Framework
- Tailwind CSS – Styling (Material You inspired)
- Anime.js – UI animations
- Lucide Icons – Modern, scalable icon system
- ExerciseDB API – External workout data
- JSONPlaceholder API - User account profile creation.
- LocalStorage – Mock data persistence (auth, profile, settings)

## Setup

To interact with the fitmate APP, navigate to this link[fitmate](https://fit-mate.netlify.app/
)

To run this repository locally, follow these steps : 
 
- Clone the repository

```shell
git git@github.com:Moringa-SDF-PT10/group-12-fitness-tracker-app-project.git
```

- Open the cloned repository in `Visual Studio Code`

- Install dependencies

```shell
npm install
```

- Run the development server

```shell
npm run dev
```

- To view in your browser, visit `http://localhost:5173`

