import React from 'react';

const Navbar = () => {
  return (
    <nav className="sticky top-0 flex justify-center items-center h-20 bg-white/90 extreme-blur shadow-[0_4px_12px_0_rgba(255,0,0,0.3)]">
      <span className="logo-font bg-gradient-to-r from-black to-red-700 bg-clip-text text-transparent drop-shadow-[0_0_4px_rgba(239,68,68,0.4)]">
        Moroccan Handicrafts
      </span>
    </nav>
  );
};

export default Navbar;