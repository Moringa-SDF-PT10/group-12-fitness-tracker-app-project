import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle, KeyRound } from 'lucide-react';

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Retrieve the email stored during the "Forgot Password" step
  const [resetEmail, setResetEmail] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('reset-email');
    if (storedEmail) {
      setResetEmail(storedEmail);
    } else {
      // If no email is found, it implies an invalid or expired session
      setError('Password reset session is invalid or has expired. Please try the "Forgot Password" process again.');
    }
  }, []);

  const handleReset = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!resetEmail) {
        setError('Password reset session is invalid. Please start over.');
        return;
    }
    if (!password || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }

    // Simulate password reset: In a real app, this would involve an API call.
    // For this mock, we'll just log it and assume success.
    // If you were linking this to your AuthContext, you'd find the user by 'resetEmail'
    // and update their password.
    console.log(`Password for ${resetEmail} would be reset to: ${password}`);
    
    // For a more complete mock, you could update the user in localStorage if they exist
    const usersJSON = localStorage.getItem('fitbuddy-users');
    if (usersJSON) {
        let users = JSON.parse(usersJSON);
        const userIndex = users.findIndex(u => u.email === resetEmail);
        if (userIndex !== -1) {
            users[userIndex].password = password; // In a real app, hash this password
            localStorage.setItem('fitbuddy-users', JSON.stringify(users));
        }
    }

    localStorage.removeItem('reset-email'); // Clear the reset token/email

    setSuccess(true);
    setTimeout(() => navigate('/login'), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF7F5] p-4">
      <div className="w-full max-w-md bg-[#FFFFFF] p-8 rounded-2xl shadow-xl border border-[#F5E0D5]">
        <div className="text-center mb-8">
            <KeyRound className="w-16 h-16 text-[#FFB6C1] mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-[#6D4C41]">Set New Password</h2>
            {resetEmail && !success && <p className="text-[#A1887F] mt-1">Enter a new password for <span className="font-medium text-[#6D4C41]">{resetEmail}</span>.</p>}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
        {success && (
          <div className="text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <p className="text-lg font-medium text-[#6D4C41]">Password Reset Successful!</p>
            <p className="text-sm text-[#A1887F]">You can now login with your new password. Redirecting...</p>
          </div>
        )}

        {!success && resetEmail && ( // Only show form if email exists and not yet successful
          <form onSubmit={handleReset} className="space-y-6">
            <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-[#A1887F] mb-1">New Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-[#A1887F]" />
                    </div>
                    <input
                        id="new-password"
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-10 pr-3 py-2.5 border border-[#F5E0D5] rounded-xl focus:ring-2 focus:ring-[#FFB6C1] focus:border-[#FFB6C1] bg-[#FFFFFF] text-[#6D4C41] placeholder-[#A1887F] transition-colors"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-[#A1887F] mb-1">Confirm New Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-[#A1887F]" />
                    </div>
                    <input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full pl-10 pr-3 py-2.5 border border-[#F5E0D5] rounded-xl focus:ring-2 focus:ring-[#FFB6C1] focus:border-[#FFB6C1] bg-[#FFFFFF] text-[#6D4C41] placeholder-[#A1887F] transition-colors"
                    />
                </div>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center px-8 py-3 bg-[#FFB6C1] text-white font-semibold rounded-xl shadow-md hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105"
            >
              Reset Password
            </button>
          </form>
        )}
         {!success && (
            <p className="mt-6 text-sm text-center">
            <Link to="/login" className="font-medium text-[#FFB6C1] hover:text-[#FFDAC1] transition-colors">
                Back to Login
            </Link>
            </p>
         )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;