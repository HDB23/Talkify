import React from "react";

type Props = {
  children: React.ReactNode;
};

export const AppBackground = ({ children }: Props) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#eef6ff] via-[#f7faff] to-white overflow-x-hidden">
      {/* Decorative Cloud Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        
        {/* Top Left Cloud */}
        <div className="absolute top-[5%] -left-[10%] sm:left-[2%] opacity-85 w-[180px] sm:w-[280px] h-auto animate-pulse" style={{ animationDuration: '8s' }}>
          <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_8px_16px_rgba(224,236,255,0.4)]">
            <path d="M20 40c0-5.5 4.5-10 10-10 1 0 2 .2 3 .5C36 24.5 42.5 20 50 20c10 0 18 8 18 18 0 .7-.1 1.3-.2 2 .8-.2 1.7-.3 2.5-.3 6.6 0 12 5.4 12 12s-5.4 12-12 12H20C9 61.7 0 52 0 40s9-21.7 20-20z" fill="url(#cloudGrad)"/>
            <defs>
              <linearGradient id="cloudGrad" x1="50" y1="0" x2="50" y2="60" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffffff" stopOpacity="0.95"/>
                <stop offset="1" stopColor="#e1efff" stopOpacity="0.85"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Top Right Cloud */}
        <div className="absolute top-[8%] -right-[12%] sm:right-[5%] opacity-95 w-[160px] sm:w-[240px] h-auto animate-pulse" style={{ animationDuration: '11s' }}>
          <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_8px_16px_rgba(224,236,255,0.3)]">
            <path d="M20 40c0-5.5 4.5-10 10-10 1 0 2 .2 3 .5C36 24.5 42.5 20 50 20c10 0 18 8 18 18 0 .7-.1 1.3-.2 2 .8-.2 1.7-.3 2.5-.3 6.6 0 12 5.4 12 12s-5.4 12-12 12H20C9 61.7 0 52 0 40s9-21.7 20-20z" fill="url(#cloudGrad2)"/>
            <defs>
              <linearGradient id="cloudGrad2" x1="50" y1="0" x2="50" y2="60" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffffff" stopOpacity="0.98"/>
                <stop offset="1" stopColor="#e5f1ff" stopOpacity="0.9"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Left Side Mid Cloud */}
        <div className="absolute top-[45%] -left-[15%] sm:-left-[5%] opacity-75 w-[200px] sm:w-[320px] h-auto animate-pulse" style={{ animationDuration: '14s' }}>
          <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_8px_16px_rgba(224,236,255,0.2)]">
            <path d="M20 40c0-5.5 4.5-10 10-10 1 0 2 .2 3 .5C36 24.5 42.5 20 50 20c10 0 18 8 18 18 0 .7-.1 1.3-.2 2 .8-.2 1.7-.3 2.5-.3 6.6 0 12 5.4 12 12s-5.4 12-12 12H20C9 61.7 0 52 0 40s9-21.7 20-20z" fill="url(#cloudGrad)"/>
          </svg>
        </div>

        {/* Right Side Mid Cloud */}
        <div className="absolute top-[60%] -right-[15%] sm:-right-[8%] opacity-80 w-[190px] sm:w-[300px] h-auto animate-pulse" style={{ animationDuration: '10s' }}>
          <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_8px_16px_rgba(224,236,255,0.25)]">
            <path d="M20 40c0-5.5 4.5-10 10-10 1 0 2 .2 3 .5C36 24.5 42.5 20 50 20c10 0 18 8 18 18 0 .7-.1 1.3-.2 2 .8-.2 1.7-.3 2.5-.3 6.6 0 12 5.4 12 12s-5.4 12-12 12H20C9 61.7 0 52 0 40s9-21.7 20-20z" fill="url(#cloudGrad2)"/>
          </svg>
        </div>

        {/* Bottom Left Cloud */}
        <div className="absolute bottom-[2%] -left-[10%] sm:left-[1%] opacity-90 w-[220px] sm:w-[360px] h-auto animate-pulse" style={{ animationDuration: '12s' }}>
          <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M20 40c0-5.5 4.5-10 10-10 1 0 2 .2 3 .5C36 24.5 42.5 20 50 20c10 0 18 8 18 18 0 .7-.1 1.3-.2 2 .8-.2 1.7-.3 2.5-.3 6.6 0 12 5.4 12 12s-5.4 12-12 12H20C9 61.7 0 52 0 40s9-21.7 20-20z" fill="url(#cloudGrad)"/>
          </svg>
        </div>

        {/* Bottom Right Cloud */}
        <div className="absolute bottom-[5%] -right-[12%] sm:right-[2%] opacity-85 w-[200px] sm:w-[340px] h-auto animate-pulse" style={{ animationDuration: '9s' }}>
          <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M20 40c0-5.5 4.5-10 10-10 1 0 2 .2 3 .5C36 24.5 42.5 20 50 20c10 0 18 8 18 18 0 .7-.1 1.3-.2 2 .8-.2 1.7-.3 2.5-.3 6.6 0 12 5.4 12 12s-5.4 12-12 12H20C9 61.7 0 52 0 40s9-21.7 20-20z" fill="url(#cloudGrad2)"/>
          </svg>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full h-full min-h-screen">
        {children}
      </div>
    </div>
  );
};
