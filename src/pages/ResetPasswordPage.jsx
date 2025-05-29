// src/pages/ResetPasswordPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem('reset-email'); // mock user

  const handleReset = (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    if (!email) {
      setError('Reset session expired or invalid');
      return;
    }

    // Simulate password reset
    const updatedUser = { ...JSON.parse(localStorage.getItem('fitbuddy-user') || '{}'), password };
    localStorage.setItem('fitbuddy-user', JSON.stringify(updatedUser));

    // Clear reset token
    localStorage.removeItem('reset-email');

    setSuccess(true);
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-white">Reset Password</h2>
        {!success ? (
          <form onSubmit={handleReset} className="space-y-4">
            {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
            <input
              type="password"
              placeholder="New password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="password"
              placeholder="Confirm password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Reset Password
            </button>
          </form>
        ) : (
          <p className="text-green-600 dark:text-green-400 text-center">Password reset successful! Redirecting...</p>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
