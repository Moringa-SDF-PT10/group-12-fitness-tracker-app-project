import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle, KeyRound } from 'lucide-react';

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [resetEmail, setResetEmail] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('reset-email');
    if (storedEmail) {
      setResetEmail(storedEmail);
    } else {
      setError('Password reset session is invalid or has expired. Please try the "Forgot Password" process again.');
    }
  }, []);

  const handleReset = (e) => {
    e.preventDefault();
    setError('');

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

    console.log(`Password for ${resetEmail} would be reset to: ${password}`);
    
    const usersJSON = localStorage.getItem('fitbuddy-users');
    if (usersJSON) {
        let users = JSON.parse(usersJSON);
        const userIndex = users.findIndex(u => u.email === resetEmail);
        if (userIndex !== -1) {
            users[userIndex].password = password; 
            localStorage.setItem('fitbuddy-users', JSON.stringify(users));
        }
    }

    localStorage.removeItem('reset-email'); 

    setSuccess(true);
    setTimeout(() => navigate('/login'), 2500);
  };

  return (

    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] p-4">
      <div className="w-full max-w-md bg-[#FFFFFF] p-8 rounded-2xl shadow-xl border border-[#D1D1D1]">
        <div className="text-center mb-8">
            <KeyRound className="w-16 h-16 text-[#05BFDB] mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-[#0B0B0B]">Set New Password</h2>
            {resetEmail && !success && <p className="text-[#3E3E3E] mt-1">Enter a new password for <span className="font-medium text-[#0B0B0B]">{resetEmail}</span>.</p>}
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
            <p className="text-lg font-medium text-[#0B0B0B]">Password Reset Successful!</p>
            <p className="text-sm text-[#3E3E3E]">You can now login with your new password. Redirecting...</p>
          </div>
        )}

        {!success && resetEmail && ( 
          <form onSubmit={handleReset} className="space-y-6">
            <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-[#6C757D] mb-1">New Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-[#6C757D]" />
                    </div>
                    <input
                        id="new-password"
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-10 pr-3 py-2.5 border border-[#B0B0B0] rounded-xl focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] bg-[#FFFFFF] text-[#3E3E3E] placeholder-[#6C757D] transition-colors"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-[#6C757D] mb-1">Confirm New Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-[#6C757D]" />
                    </div>
                    <input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full pl-10 pr-3 py-2.5 border border-[#B0B0B0] rounded-xl focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] bg-[#FFFFFF] text-[#3E3E3E] placeholder-[#6C757D] transition-colors"
                    />
                </div>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center px-8 py-3 bg-[#0A4D68] text-white font-semibold rounded-xl shadow-md hover:bg-[#083D53] transition-all duration-300 transform hover:scale-105"
            >
              Reset Password
            </button>
          </form>
        )}
         {!success && (
            <p className="mt-6 text-sm text-center">
            <Link to="/login" className="font-medium text-[#05BFDB] hover:text-[#049DB4] transition-colors">
                Back to Login
            </Link>
            </p>
         )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
