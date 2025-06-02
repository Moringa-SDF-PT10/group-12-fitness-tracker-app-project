import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Send, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); 
    
    if (!email) {
        setError('Please enter your email address.');
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setError('Please enter a valid email address.');
        return;
    }

    console.log(`Password reset link would be sent to: ${email}`);
    localStorage.setItem('reset-email', email); 
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] p-4">
      <div className="w-full max-w-md bg-[#FFFFFF] p-8 rounded-2xl shadow-xl border border-[#D1D1D1]">
        <div className="text-center mb-8">
            <Mail className="w-16 h-16 text-[#05BFDB] mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-[#0B0B0B]">Forgot Password?</h2>
            <p className="text-[#3E3E3E] mt-1">No worries! Enter your email and we'll help you reset it.</p>
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
                <label htmlFor="email-forgot" className="block text-sm font-medium text-[#6C757D] mb-1">Email Address</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-[#6C757D]" />
                    </div>
                    <input
                        id="email-forgot"
                        type="email"
                        placeholder="Enter your registered email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-3 py-2.5 border border-[#B0B0B0] rounded-xl focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] bg-[#FFFFFF] text-[#3E3E3E] placeholder-[#6C757D] transition-colors"
                    />
                </div>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center px-8 py-3 bg-[#0A4D68] text-white font-semibold rounded-xl shadow-md hover:bg-[#083D53] transition-all duration-300 transform hover:scale-105"
            >
              <Send className="w-5 h-5 mr-2" /> Send Reset Link
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <p className="text-lg font-medium text-[#0B0B0B]">Reset Link Sent (Mock)</p>
            <p className="text-sm text-[#3E3E3E]">
              If an account exists for <span className="font-semibold text-[#0B0B0B]">{email}</span>, you will receive an email with instructions to reset your password.
            </p>
            <button
              onClick={() => navigate('/reset-password')}
              className="w-full flex items-center justify-center px-8 py-3 bg-[#17A2B8] text-white font-semibold rounded-xl shadow-md hover:bg-[#138496] transition-all duration-300"
            >
              Proceed to Reset (Mock) <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        )}
        <p className="mt-6 text-sm text-center">
          <Link to="/login" className="font-medium text-[#05BFDB] hover:text-[#049DB4] transition-colors">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
