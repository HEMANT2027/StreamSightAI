import React from 'react';

// Using the same consistent logo icon from the Navbar
const LogoIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
        <defs>
            <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A5B4FC" /> 
                <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
        </defs>
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM8.707 8.707a1 1 0 00-1.414 1.414L10.586 12l-3.293 3.293a1 1 0 101.414 1.414L12 13.414l3.293 3.293a1 1 0 001.414-1.414L13.414 12l3.293-3.293a1 1 0 00-1.414-1.414L12 10.586 8.707 8.707z" fill="url(#footerLogoGradient)"/>
    </svg>
);

// Custom, consistently styled SVG icons for social media links
const SocialIcon = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors duration-300">
        {children}
    </a>
);

const GithubIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
);

const TwitterIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.297 1.634 4.209 3.803 4.649-.6.164-1.242.207-1.884.151.499 1.936 2.168 3.241 4.136 3.279-1.763 1.385-3.983 2.21-6.326 2.21-.411 0-.817-.024-1.216-.07 2.288 1.469 5.015 2.32 7.942 2.32 9.473 0 14.65-7.844 14.65-14.65l-.001-.667c1.001-.72 1.868-1.62 2.56-2.675z"/></svg>
);

const LinkedInIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.769c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.769h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
);


// The main Footer component.
const Footer = () => {
  return (
    <footer className="relative bg-gray-900 pt-20 pb-8 px-6 lg:px-10 tracking-wide overflow-hidden">
        {/* A futuristic, animated grid background */}
        <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_1000px_at_50%_0px,#1e3a8a44,transparent)]"></div>
        </div>

        <div className="max-w-screen-xl mx-auto">
            {/* Top section with tagline and newsletter signup */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-10 border-b border-gray-700/80">
                <div className="text-center lg:text-left">
                    <h3 className="text-3xl font-bold text-white">Stay Ahead of the Curve</h3>
                    <p className="text-gray-400 mt-2">Get the latest on visual AI, product updates, and case studies.</p>
                </div>
                <form className="w-full max-w-md">
                    <div className="flex items-center border border-gray-600/80 rounded-full p-1 bg-gray-800/50 backdrop-blur-sm focus-within:border-blue-500 transition-all duration-300">
                        <input type="email" placeholder="Enter your email" className="w-full bg-transparent p-2 pl-4 text-white placeholder-gray-500 focus:outline-none" />
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-5 py-2 transition-colors duration-300">
                            Subscribe
                        </button>
                    </div>
                </form>
            </div>

            {/* Main grid with links */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-10">
                {/* Logo and tagline column */}
                <div className="col-span-2 md:col-span-4 lg:col-span-1">
                    <a href="/" className="flex items-center mb-4">
                        <LogoIcon />
                        <span className="text-2xl font-bold text-white tracking-tighter">StreamSight AI</span>
                    </a>
                    <p className="text-gray-400 text-sm max-w-xs">See beyond the pixels. Understand the action.</p>
                </div>

                {/* Link columns */}
                <div>
                    <h4 className="text-base font-semibold mb-4 text-white">Platform</h4>
                    <ul className="space-y-3">
                        <li><a href="/features" className="text-slate-400 hover:text-white text-sm transition-colors duration-300">Features</a></li>
                        <li><a href="/demo" className="text-slate-400 hover:text-white text-sm transition-colors duration-300">Live Demo</a></li>
                        <li><a href="/pricing" className="text-slate-400 hover:text-white text-sm transition-colors duration-300">Pricing</a></li>
                        <li><a href="/status" className="text-slate-400 hover:text-white text-sm transition-colors duration-300">System Status</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-base font-semibold mb-4 text-white">Resources</h4>
                    <ul className="space-y-3">
                        <li><a href="/docs" className="text-slate-400 hover:text-white text-sm transition-colors duration-300">Documentation</a></li>
                        <li><a href="/api" className="text-slate-400 hover:text-white text-sm transition-colors duration-300">API Reference</a></li>
                        <li><a href="/case-studies" className="text-slate-400 hover:text-white text-sm transition-colors duration-300">Case Studies</a></li>
                        <li><a href="/blog" className="text-slate-400 hover:text-white text-sm transition-colors duration-300">Blog</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-base font-semibold mb-4 text-white">Developers</h4>
                    <ul className="space-y-3">
                        <li><a href="https://github.com/MantraHackathon" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white text-sm transition-colors duration-300">GitHub</a></li>
                        <li><a href="/community" className="text-slate-400 hover:text-white text-sm transition-colors duration-300">Community Forum</a></li>
                        <li><a href="/hackathon" className="text-slate-400 hover:text-white text-sm transition-colors duration-300">Hackathon Project</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-base font-semibold mb-4 text-white">Company</h4>
                    <ul className="space-y-3">
                        <li><a href="/about" className="text-slate-400 hover:text-white text-sm transition-colors duration-300">About Us</a></li>
                        <li><a href="/contact" className="text-slate-400 hover:text-white text-sm transition-colors duration-300">Contact</a></li>
                        <li><a href="/careers" className="text-slate-400 hover:text-white text-sm transition-colors duration-300">Careers</a></li>
                    </ul>
                </div>
            </div>

            {/* Bottom section with copyright and social links */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 mt-8 border-t border-gray-700/80">
                <p className="text-slate-400 text-sm">© {new Date().getFullYear()} StreamSight AI. All rights reserved.</p>
                <div className="flex space-x-6">
                    <SocialIcon href="https://github.com/MantraHackathon"><GithubIcon /></SocialIcon>
                    <SocialIcon href="#"><TwitterIcon /></SocialIcon>
                    <SocialIcon href="#"><LinkedInIcon /></SocialIcon>
                </div>
            </div>
        </div>
    </footer>
  );
};

export default Footer;
