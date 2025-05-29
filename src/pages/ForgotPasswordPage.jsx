import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate sending reset link (store email in localStorage)
    localStorage.setItem('reset-email', email);
    setSubmitted(true);
  };

  const goToReset = () => {
    navigate('/reset-password');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-white">Forgot Password</h2>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-green-600 dark:text-green-400 mb-4">Reset link sent! (mock)</p>
            <button
              onClick={goToReset}
              className="text-blue-600 underline hover:text-blue-800 transition"
            >
              Go to Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
