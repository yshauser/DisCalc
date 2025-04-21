// src/components/Header.tsx

import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="header">
      <button className="menu-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" x2="20" y1="12" y2="12"></line>
          <line x1="4" x2="20" y1="6" y2="6"></line>
          <line x1="4" x2="20" y1="18" y2="18"></line>
        </svg>
      </button>
      <div className="header-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2"></rect>
          <path d="m18 8-2 8-8-2 2-8 8 2Z"></path>
          <path d="M10 14v.5"></path>
          <path d="M14 9.5V10"></path>
        </svg>
        <h1>כמה זה יוצא לי - מחשבון הנחות</h1>
      </div>
      <div className="spacer"></div>
    </header>
  );
};

export default Header;