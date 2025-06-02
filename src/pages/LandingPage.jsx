import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, LogIn, UserPlus } from 'lucide-react';

const motion = { 
    div: ({children, ...props}) => <div {...props}>{children}</div>, 
    h1: ({children, ...props}) => <h1 {...props}>{children}</h1>, 
    p: ({children, ...props}) => <p {...props}>{children}</p>,
    footer: ({children, ...props}) => <footer {...props}>{children}</footer> 
};


const LandingPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] p-4 text-center">
    <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8"
    >
        <Dumbbell className="w-24 h-24 text-[#05BFDB] mx-auto" />
    </motion.div>
    
    <motion.h1 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 120 }}
        className="text-4xl md:text-5xl font-bold text-[#0B0B0B] mb-4"
    >
      Welcome to <span className="text-[#05BFDB]">Fit-Mate</span>
    </motion.h1>
    
    <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-lg text-[#3E3E3E] mb-10 max-w-md"
    >
      Your ultimate companion for tracking workouts, achieving fitness goals, and living a healthier life. Let's get started!
    </motion.p>
    
    <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-xs sm:max-w-sm"
    >
      <Link
        to="/login"
        className="w-full flex items-center justify-center px-8 py-3 bg-[#0A4D68] text-white font-semibold rounded-xl shadow-md hover:bg-[#083D53] transition-all duration-300 transform hover:scale-105"
      >
        <LogIn className="w-5 h-5 mr-2" /> Login
      </Link>
      <Link
        to="/register"
        className="w-full flex items-center justify-center px-8 py-3 bg-white text-[#0A4D68] border-2 border-[#0A4D68] font-semibold rounded-xl shadow-md hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
      >
        <UserPlus className="w-5 h-5 mr-2" /> Register
      </Link>
    </motion.div>
    
    <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="mt-16 text-sm text-[#6C757D]"
    >
        <p>&copy; {new Date().getFullYear()} Fit-Mate. All rights reserved.</p>
        <p>Your journey to fitness excellence begins now.</p>
    </motion.footer>
  </div>
);

export default LandingPage;
