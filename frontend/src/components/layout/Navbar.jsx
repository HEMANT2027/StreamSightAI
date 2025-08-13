import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// The "next-level" SVG icon for the logo.
const LogoIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 transform group-hover:rotate-12 transition-transform duration-500 ease-in-out">
        <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" /> 
                <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
        </defs>
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM8.707 8.707a1 1 0 00-1.414 1.414L10.586 12l-3.293 3.293a1 1 0 101.414 1.414L12 13.414l3.293 3.293a1 1 0 001.414-1.414L13.414 12l3.293-3.293a1 1 0 00-1.414-1.414L12 10.586 8.707 8.707z" fill="url(#logoGradient)"/>
    </svg>
);

// An icon for the CTA button.
const StartIcon = () => (
    <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17.25l4.5-4.5-4.5-4.5m6 9l4.5-4.5-4.5-4.5"></path>
    </svg>
);

// This is the main Navbar component, combining the best of both versions.
const Navbar = () => {

  const navigate = useNavigate();

  const handleStart = () =>{
    navigate("/chat");
  }

  // Using the reliable useState hook to control the menu.
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // State to track scroll position for dynamic header styling.
  const [isScrolled, setIsScrolled] = useState(false);

  // This effect adds a listener to track scroll position.
  useEffect(() => {
    const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (

    


    // Header styling changes based on scroll position for a modern effect.
    <header className={`fixed top-0 left-0 w-full py-4 px-4 sm:px-10 flex items-center z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-md border-b border-gray-200/80' : 'bg-transparent'}`}>
      <div className="flex flex-wrap items-center justify-between gap-5 w-full">
        
        {/* Logo and Website Name */}
        <a href="/" className="flex items-center group">
          <LogoIcon />
          <span className="text-2xl font-bold text-gray-900 tracking-tighter">StreamSight AI</span>
        </a>

        {/* The mobile menu container. Its visibility is toggled by changing translate-x classes. */}
        <div 
          className={`
            max-lg:fixed max-lg:top-0 max-lg:right-0 max-lg:w-full max-lg:max-w-sm max-lg:h-full max-lg:bg-white max-lg:shadow-lg max-lg:p-6 max-lg:transform max-lg:transition-transform max-lg:duration-300
            lg:!flex lg:items-center lg:static lg:bg-transparent lg:p-0 lg:shadow-none lg:transform-none
            ${isMenuOpen ? 'max-lg:translate-x-0' : 'max-lg:translate-x-full'}
          `}
        >
          
          {/* Close button for the mobile menu */}
          <button onClick={() => setIsMenuOpen(false)} className="lg:hidden absolute top-5 right-5 z-[100] rounded-full bg-gray-100 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation links list */}
          <ul className="lg:flex lg:items-center lg:gap-x-2 max-lg:mt-10 max-lg:space-y-4">
            <li>
              <a href='/features' className="text-gray-600 hover:text-blue-600 font-medium text-[15px] transition-colors duration-300 relative group">
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              
            </li>
            <li>
              <a href='/demo' className="text-gray-600 hover:text-blue-600 font-medium text-[15px] transition-colors duration-300 relative group">
                Demo
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </li>
            <li>
              <a href='https://github.com/MantraHackathon' target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 font-medium text-[15px] transition-colors duration-300 relative group">
                Source Code
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </li>
          </ul>
        </div>

        <div className="flex items-center ml-auto lg:ml-4 space-x-4">
            {/* The main call-to-action button */}
            <button onClick={handleStart} className="group flex items-center justify-center px-6 py-3 text-base font-bold text-white bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                <StartIcon />
                Start Analysis
            </button>

            {/* Hamburger icon to open the menu on mobile */}
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden">
                <svg className="w-7 h-7" fill="#333" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                </svg>
            </button>
        </div>

      </div>
    </header>
  );
}

export default Navbar;
