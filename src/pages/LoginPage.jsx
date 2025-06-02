import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); 

    const result = login(email, password);
    if (result === true) {
      navigate('/dashboard');
    } else {
      setError(result || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] p-4">
      <div className="w-full max-w-md bg-[#FFFFFF] p-8 rounded-2xl shadow-xl border border-[#D1D1D1]">
        <div className="text-center mb-8">
            <LogIn className="w-16 h-16 text-[#05BFDB] mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-[#0B0B0B]">Welcome Back!</h2>
            <p className="text-[#3E3E3E] mt-1">Please login to continue your fitness journey.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#6C757D] mb-1">Email Address</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#6C757D]" />
                </div>
                <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    required
                    className="w-full pl-10 pr-3 py-2.5 border border-[#B0B0B0] rounded-xl focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] bg-[#FFFFFF] text-[#3E3E3E] placeholder-[#6C757D] transition-colors"
                />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#6C757D] mb-1">Password</label>
            <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#6C757D]" />
                </div>
                <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="w-full pl-10 pr-3 py-2.5 border border-[#B0B0B0] rounded-xl focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] bg-[#FFFFFF] text-[#3E3E3E] placeholder-[#6C757D] transition-colors"
                />
            </div>
          </div>
          
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-[#05BFDB] hover:text-[#049DB4] transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center px-8 py-3 bg-[#0A4D68] text-white font-semibold rounded-xl shadow-md hover:bg-[#083D53] transition-all duration-300 transform hover:scale-105"
          >
            <LogIn className="w-5 h-5 mr-2" /> Login
          </button>

          <p className="mt-6 text-sm text-center text-[#3E3E3E]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-[#05BFDB] hover:text-[#049DB4] transition-colors"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
