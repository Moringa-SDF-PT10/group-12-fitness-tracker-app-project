import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Send, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(''); // Added error state
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    // Basic email validation
    if (!email) {
        setError('Please enter your email address.');
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setError('Please enter a valid email address.');
        return;
    }

    // Simulate sending reset link
    console.log(`Password reset link would be sent to: ${email}`);
    localStorage.setItem('reset-email', email); // Store for mock reset process
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF7F5] p-4">
      <div className="w-full max-w-md bg-[#FFFFFF] p-8 rounded-2xl shadow-xl border border-[#F5E0D5]">
        <div className="text-center mb-8">
            <Mail className="w-16 h-16 text-[#FFB6C1] mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-[#6D4C41]">Forgot Password?</h2>
            <p className="text-[#A1887F] mt-1">No worries! Enter your email and we'll help you reset it.</p>
        </div>
        
        {error && !submitted && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="email-forgot" className="block text-sm font-medium text-[#A1887F] mb-1">Email Address</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-[#A1887F]" />
                    </div>
                    <input
                        id="email-forgot"
                        type="email"
                        placeholder="Enter your registered email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-3 py-2.5 border border-[#F5E0D5] rounded-xl focus:ring-2 focus:ring-[#FFB6C1] focus:border-[#FFB6C1] bg-[#FFFFFF] text-[#6D4C41] placeholder-[#A1887F] transition-colors"
                    />
                </div>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center px-8 py-3 bg-[#FFB6C1] text-white font-semibold rounded-xl shadow-md hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105"
            >
              <Send className="w-5 h-5 mr-2" /> Send Reset Link
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <p className="text-lg font-medium text-[#6D4C41]">Reset Link Sent (Mock)</p>
            <p className="text-sm text-[#A1887F]">
              If an account exists for <span className="font-semibold text-[#6D4C41]">{email}</span>, you will receive an email with instructions to reset your password.
            </p>
            <button
              onClick={() => navigate('/reset-password')} // Navigate to reset page (for mock flow)
              className="w-full flex items-center justify-center px-8 py-3 bg-[#FFDAC1] text-[#6D4C41] font-semibold rounded-xl shadow-md hover:bg-opacity-80 transition-all duration-300"
            >
              Proceed to Reset (Mock) <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        )}
        <p className="mt-6 text-sm text-center">
          <Link to="/login" className="font-medium text-[#FFB6C1] hover:text-[#FFDAC1] transition-colors">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;