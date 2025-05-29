import { Link } from 'react-router-dom';

const LandingPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 text-center">
      Welcome to FitMate 💪
    </h1>
    <p className="text-lg text-gray-600 mb-8 text-center">
      <h2>Your fitness journey starts here.</h2>
    </p>
    <div className="flex space-x-4">
      <Link
        to="/login"
        className="px-6 py-2 bg-blue-600 text-white rounded-2xl shadow hover:bg-blue-700 transition"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="px-6 py-2 bg-gray-100 text-blue-600 border border-blue-600 rounded-2xl shadow hover:bg-blue-50 transition"
      >
        Register
      </Link>
    </div>
  </div>
);

export default LandingPage;

