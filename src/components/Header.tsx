// src/components/Header.tsx

import React, {useState, useRef, useEffect} from 'react';
import './Header.css';
import packageJson from '../../package.json'; // Adjust path as needed
import ilFlag from '../assets/flags/il.png';
import ukFlag from '../assets/flags/uk.png';

interface MenuItem {
  label: string;
  icon?: React.FC<{ className?: string }>;
}
const Header: React.FC = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isLangOpen, setLangOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [language, setLanguage] = useState<'HE' | 'EN'>('HE');

  const langRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setMenuOpen(!isMenuOpen);
  const toggleLang = () => setLangOpen(!isLangOpen);

  const handleLanguageSelect = (lang: 'HE' | 'EN') => {
    setLanguage(lang);
    setLangOpen(false);
    document.documentElement.dir = lang === 'HE' ? 'rtl' : 'ltr';
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      langRef.current &&
      !langRef.current.contains(event.target as Node)
    ) {
      setLangOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="header">
        <button className="menu-button" onClick={toggleMenu} aria-label="Menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
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
        </div>
      </div>

      <div className="actions-container">
          <div className="language-selector" ref={langRef}>
            <button className="language-toggle" onClick={toggleLang}>
              <img src={language === 'HE' ? ilFlag : ukFlag} alt="flag" className="flag-icon" />
              <span>{language}</span>
            </button>
            {isLangOpen && (
              <div className="language-dropdown">
                <div onClick={() => handleLanguageSelect('HE')}>
                  <img src={ilFlag} alt="IL" className="flag-icon" />
                  HE
                </div>
                <div onClick={() => handleLanguageSelect('EN')}>
                  <img src={ukFlag} alt="EN" className="flag-icon" />
                  EN
                </div>
              </div>
            )}
          </div>
        </div>
        {isMenuOpen && (
          <div className="menu-dropdown">
            <div onClick={() => { setShowAbout(true); setMenuOpen(false); }}>
              אודות
            </div>
          </div>
        )}
      </header>

      {showAbout && (
        <div className="modal-overlay" onClick={() => setShowAbout(false)}>
          <div className="about-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>כמה זה יוצא לי - מחשבון הנחות</h2>
            <p>גרסה: {packageJson.version}</p>
            <p>מפתח: יוסי האוזר</p>
            <p>
              צור קשר: <a href="mailto:yshauser@gmail.com">yshauser@gmail.com</a>
            </p>
            <button onClick={() => setShowAbout(false)} className="about-close-button">סגור</button>
          </div>
        </div>
      )}
    </>
  );

};

export default Header;