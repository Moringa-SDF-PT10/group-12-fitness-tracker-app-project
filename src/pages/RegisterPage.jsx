import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User as UserIcon, AlertCircle, CheckCircle } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");


  useEffect(() => {
    // Optional: Clear fields if needed
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }

    const result = register(name, email, password);
    if (result === true) {
      setSuccessMessage(`Welcome, ${name}! Registration successful. Redirecting to login...`);
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } else {
      setError(result || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] p-4">
      <div className="w-full max-w-md bg-[#FFFFFF] p-8 rounded-2xl shadow-xl border border-[#D1D1D1]">
        <div className="text-center mb-8">
            <UserPlus className="w-16 h-16 text-[#05BFDB] mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-[#0B0B0B]">Create Your Account</h2>
            <p className="text-[#3E3E3E] mt-1">Join Fit-Mate and start your fitness journey today!</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {successMessage}
          </div>
        )}

        {!successMessage && (
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#6C757D] mb-1">Full Name</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-[#6C757D]" />
                    </div>
                    <input
                        id="name"
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        autoComplete="name"
                        required
                        className="w-full pl-10 pr-3 py-2.5 border border-[#B0B0B0] rounded-xl focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] bg-[#FFFFFF] text-[#3E3E3E] placeholder-[#6C757D] transition-colors"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="email-register" className="block text-sm font-medium text-[#6C757D] mb-1">Email Address</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-[#6C757D]" />
                    </div>
                    <input
                        id="email-register"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                        className="w-full pl-10 pr-3 py-2.5 border border-[#B0B0B0] rounded-xl focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] bg-[#FFFFFF] text-[#3E3E3E] placeholder-[#6C757D] transition-colors"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="password-register" className="block text-sm font-medium text-[#6C757D] mb-1">Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-[#6C757D]" />
                    </div>
                    <input
                        id="password-register"
                        type="password"
                        placeholder="Create a strong password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                        className="w-full pl-10 pr-3 py-2.5 border border-[#B0B0B0] rounded-xl focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] bg-[#FFFFFF] text-[#3E3E3E] placeholder-[#6C757D] transition-colors"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full flex items-center justify-center px-8 py-3 bg-[#0A4D68] text-white font-semibold rounded-xl shadow-md hover:bg-[#083D53] transition-all duration-300 transform hover:scale-105"
            >
                <UserPlus className="w-5 h-5 mr-2" /> Register
            </button>

            <p className="mt-6 text-sm text-center text-[#3E3E3E]">
                Already have an account?{" "}
                <Link
                to="/login"
                className="font-medium text-[#05BFDB] hover:text-[#049DB4] transition-colors"
                >
                Login here
                </Link>
            </p>
            </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
