// src/components/Header.tsx

import React, {useState, useRef, useEffect, useContext} from 'react';
import './Header.css';
import packageJson from '../../package.json'; // Adjust path as needed
import ilFlag from '../assets/flags/il.png';
import ukFlag from '../assets/flags/uk.png';
import logo from '../assets/logo/discalc_logo_02.png';
import { useTranslation } from 'react-i18next';

interface MenuItem {
  label: string;
  icon?: React.FC<{ className?: string }>;
}

export type CurrencyType = 'ILS' | 'USD' | 'EUR';

// Create a context to share currency state throughout the app
export const CurrencyContext = React.createContext<{
  currency: CurrencyType;
  setCurrency: React.Dispatch<React.SetStateAction<CurrencyType>>;
}>({
  currency: 'ILS',
  setCurrency: () => {},
});

export const currencySymbols: Record<CurrencyType, string> = {
  ILS: '₪',
  USD: '$',
  EUR: '€',
};

const Header: React.FC = () => {
  const {t, i18n} = useTranslation();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isLangOpen, setLangOpen] = useState(false);
  const [isCurrencyOpen, setCurrencyOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  
  const initialLang = (i18n.language === 'HE' || i18n.language === 'EN') ? i18n.language : 'HE';
  const [language, setLanguage] = useState<'HE' | 'EN'>(initialLang);
  
  const {currency, setCurrency} = useContext(CurrencyContext);

  const langRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setMenuOpen(!isMenuOpen);
  const toggleLang = () => setLangOpen(!isLangOpen);
  const toggleCurrency = () => setCurrencyOpen(!isCurrencyOpen);

  const handleLanguageSelect = (lang: 'HE' | 'EN') => {
    setLanguage(lang);
    setLangOpen(false);
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'HE' ? 'rtl' : 'ltr';
  };

  const handleCurrencySelect = (curr: CurrencyType) => {
    setCurrency(curr);
    setCurrencyOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      langRef.current &&
      !langRef.current.contains(event.target as Node)
    ) {
      setLangOpen(false);
    }
    if (
      menuRef.current && 
      !menuRef.current.contains(event.target as Node)
    ){
      setMenuOpen(false);
    }
    if (
      currencyRef.current &&
      !currencyRef.current.contains(event.target as Node)
    ) {
      setCurrencyOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

 // Set initial direction based on language
 useEffect(() => {
  document.documentElement.dir = language === 'HE' ? 'rtl' : 'ltr';
}, []);
  // console.log ('header params', {language, currency})

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      <header className="header">
        <div ref={menuRef}>
          <button className="menu-button" onClick={toggleMenu} aria-label="Menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
          {isMenuOpen && (
            <div className="menu-dropdown">
              <div onClick={() => { setShowAbout(true); setMenuOpen(false); }}>
                {t('header.about')}
              </div>
            </div>
          )}
        </div>

      <div className="header-content">
        <div className="logo-container">
        <img src={logo} alt="logo" className="logo-icon" />

        </div>
        <div className="header-title">
          <h1>{t('header.title')} <br/> {t('header.subtitle')}</h1>
        </div>
      </div>

      <div className="actions-container">
          {/* Currency Selector */}
          <div className="currency-selector" ref={currencyRef}>
            <button className="currency-toggle" onClick={toggleCurrency}>
              <span>{currency} {currencySymbols[currency]}</span>
            </button>
            {isCurrencyOpen && (
              <div className="currency-dropdown">
                <div onClick={() => handleCurrencySelect('ILS')}>
                  <span>ILS ({currencySymbols.ILS})</span>
                </div>
                <div onClick={() => handleCurrencySelect('USD')}>
                  <span>USD ({currencySymbols.USD})</span>
                </div>
                <div onClick={() => handleCurrencySelect('EUR')}>
                  <span>EUR ({currencySymbols.EUR})</span>
                </div>
              </div>
            )}
          </div>


          <div className="language-selector" ref={langRef}>
            <button className="language-toggle" onClick={toggleLang}>
              <img src={language === 'HE' ? ilFlag : ukFlag} alt="flag" className="flag-icon" />
              <span>{language}</span>
            </button>
            {isLangOpen && (
              <div className="language-dropdown">
                <div onClick={() => handleLanguageSelect('HE')}>
                  <img src={ilFlag} alt="IL" className="flag-icon" />
                  <span>HE</span>
                </div>
                <div onClick={() => handleLanguageSelect('EN')}>
                  <img src={ukFlag} alt="EN" className="flag-icon" />
                  <span>EN</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {showAbout && (
        <div className="modal-overlay" onClick={() => setShowAbout(false)}>
          <div className="about-modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>{t('about.title')}</h2>
            <p>{t('about.version')}: {packageJson.version}</p>
            <p>{t('about.developer')}</p>
            <p>
              {t('about.contact')}: <a href="mailto:yshauser@gmail.com">yshauser@gmail.com</a>
            </p>
            <button onClick={() => setShowAbout(false)} className="about-close-button">סגור</button>
          </div>
        </div>
      )}
    </CurrencyContext.Provider>
  );

};

export default Header;