import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, LogIn, UserPlus } from 'lucide-react';
// import { motion } from "framer-motion"; // Uncomment this if you have framer-motion installed

// Mock motion for environments where framer-motion might not be installed or for linting.
// In a real project, you would install and import framer-motion.
const motion = { 
    div: ({children, ...props}) => <div {...props}>{children}</div>, 
    h1: ({children, ...props}) => <h1 {...props}>{children}</h1>, 
    p: ({children, ...props}) => <p {...props}>{children}</p>, // Corrected closing tag here
    footer: ({children, ...props}) => <footer {...props}>{children}</footer> 
};


const LandingPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#FFDAC1]/30 via-[#FFF7F5] to-[#FFB6C1]/30 p-4 text-center">
    <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8"
    >
        <Dumbbell className="w-24 h-24 text-[#FFB6C1] mx-auto" />
    </motion.div>
    
    <motion.h1 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 120 }}
        className="text-4xl md:text-5xl font-bold text-[#6D4C41] mb-4"
    >
      Welcome to <span className="text-[#FFB6C1]">Fit-Mate</span>
    </motion.h1>
    
    <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-lg text-[#A1887F] mb-10 max-w-md"
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
        className="w-full flex items-center justify-center px-8 py-3 bg-[#FFB6C1] text-white font-semibold rounded-xl shadow-md hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105"
      >
        <LogIn className="w-5 h-5 mr-2" /> Login
      </Link>
      <Link
        to="/register"
        className="w-full flex items-center justify-center px-8 py-3 bg-[#FFFFFF] text-[#FFB6C1] border-2 border-[#FFB6C1] font-semibold rounded-xl shadow-md hover:bg-[#FFDAC1]/20 transition-all duration-300 transform hover:scale-105"
      >
        <UserPlus className="w-5 h-5 mr-2" /> Register
      </Link>
    </motion.div>
    
    <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="mt-16 text-sm text-[#A1887F]"
    >
        <p>&copy; {new Date().getFullYear()} Fit-Mate. All rights reserved.</p>
        <p>Your journey to fitness excellence begins now.</p>
    </motion.footer>
  </div>
);

export default LandingPage;