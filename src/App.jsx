// App.jsx
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';

const App = () => {
  return (
    <Router>
      <nav className="navbar">
        <NavLink
          to="/settings"
          className={({ isActive }) => (isActive ? 'navlink navlink-active' : 'navlink')}
        >
          Settings
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => (isActive ? 'navlink navlink-active' : 'navlink')}
        >
          Profile
        </NavLink>
        <NavLink
          to="Dashboard"
          className={({isActive}) => (isActive ? 'navlimk navlink-active' : 'navlink')}
        >
          Dashboard
        </NavLink>
      </nav>

      <Routes>
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/Dashboard" element={<DashboardPage />} />
        <Route path="*" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
