// src/App.tsx

import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import DiscountTypeSelector from './components/DiscountTypeSelector';
import ProductTable from './components/ProductTable';
import { ProductRow, Totals, DiscountType } from './models/types';

// Import discount type components
import FixedPercentageDiscount from './discountTypes/FixedPercentageDiscount';
import VariablePercentageDiscount from './discountTypes/VariablePercentageDiscount';
import FreeProductDiscount from './discountTypes/FreeProductDiscount';
import TipCalculator from './components/TipCalculator';

const App: React.FC = () => {
  // State for rows and totals
  const [rows, setRows] = useState<ProductRow[]>([
    { id: 1, price: '', discount: '', finalPrice: '' }
  ]);
  
  const [totals, setTotals] = useState<Totals>({
    price: '0',
    discount: '0',
    finalPrice: '0'
  });
  
  // State for discount type
  const [discountType, setDiscountType] = useState<DiscountType>(DiscountType.FIXED_PERCENTAGE);
  const [fixedDiscount, setFixedDiscount] = useState<string>('');
  const [buyAmount, setBuyAmount] = useState<string>('2');
  const [getAmount, setGetAmount] = useState<string>('1');

  // Handle discount type change
  const handleDiscountTypeChange = (type: DiscountType) => {
    setDiscountType(type);
    
    // Reset rows' discount values when changing discount type
    setRows(prevRows => 
      prevRows.map(row => {
        return { ...row, discount: '', finalPrice: '' };
      })
    );
    
    // Reset totals when changing discount type
    setTotals({
      price: '0',
      discount: '0',
      finalPrice: '0'
    });
  };

  // Handle fixed discount change
  const handleFixedDiscountChange = (value: string) => {
    setFixedDiscount(value);
  };

  // Handle buy amount change
  const handleBuyAmountChange = (value: string) => {
    setBuyAmount(value);
  };

  // Handle get amount change
  const handleGetAmountChange = (value: string) => {
    setGetAmount(value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;