// src/components/Header.tsx

import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <button className="menu-button" aria-label="Menu">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" x2="20" y1="12" y2="12"></line>
          <line x1="4" x2="20" y1="6" y2="6"></line>
          <line x1="4" x2="20" y1="18" y2="18"></line>
        </svg>
      </button>
      <div className="header-content">
        <div className="logo-container">
          <svg className="header-logo" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"></rect>
            <path d="m18 8-2 8-8-2 2-8 8 2Z"></path>
            <path d="M10 14v.5"></path>
            <path d="M14 9.5V10"></path>
          </svg>
        </div>
        <div className="header-title">
          <h1>כמה זה יוצא לי - מחשבון הנחות</h1>
          {/* <h2>מחשבון הנחות</h2> */}
        </div>
      </div>
      <div className="actions-container">
        <button className="language-toggle" aria-label="Toggle language">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 8 6 6"></path>
            <path d="m4 14 6-6 2-3"></path>
            <path d="M2 5h12"></path>
            <path d="M7 2h1"></path>
            <path d="m22 22-5-10-5 10"></path>
            <path d="M14 18h6"></path>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;