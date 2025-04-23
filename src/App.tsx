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
  // console.log ('in app');
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
  // For Free product discount
    const [buyAmount, setBuyAmount] = useState<string>('2');
    const [getAmount, setGetAmount] = useState<string>('1');
  // For variable percentage discount
    const [variableMode, setVariableMode] = useState<'free' | 'tiered'>('free');
    const [tierDiscounts, setTierDiscounts] = useState<string[]>(['']);

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

  // Handle refresh/reset button click
  const handleRefresh = () => {
    // Reset rows to initial state (single empty row)
    setRows([{ id: 1, price: '', discount: '', finalPrice: '', isGroupStart: false}]);
    // Reset totals
    setTotals({
      price: '0',
      discount: '0',
      finalPrice: '0'
    });
    
    // Reset fixed discount if applicable
    if (discountType === DiscountType.FIXED_PERCENTAGE) {
      setFixedDiscount('');
    } else if (discountType === DiscountType.VARIABLE_PERCENTAGE) {
      // setVariableMode('free');
      setTierDiscounts(['']);
    } else if (discountType === DiscountType.FREE_PRODUCT) {
      setBuyAmount('2');
      setGetAmount('1');
    }

  };

  return (
    <div className="app">
      <Header />
      
      <main className="main">
        <div className="calculator-container">
            <DiscountTypeSelector
              selectedType={discountType}
              fixedDiscount={fixedDiscount}
              buyAmount={buyAmount}
              getAmount={getAmount}
              onTypeChange={handleDiscountTypeChange}
              onFixedDiscountChange={handleFixedDiscountChange}
              onBuyAmountChange={handleBuyAmountChange}
              onGetAmountChange={handleGetAmountChange}
              onRefresh={handleRefresh}

              variableMode={variableMode}
              tierDiscounts={tierDiscounts}
              onVariableModeChange={setVariableMode}
              onTierDiscountsChange={setTierDiscounts}
            />

          {/* Render the appropriate discount component based on selected type */}
          {discountType === DiscountType.FIXED_PERCENTAGE && (
            <FixedPercentageDiscount 
              rows={rows}
              fixedDiscount={fixedDiscount}
              setRows={setRows}
              setTotals={setTotals}
            />
          )}
          
          {discountType === DiscountType.VARIABLE_PERCENTAGE && (
            <VariablePercentageDiscount 
              rows={rows}
              setRows={setRows}
              setTotals={setTotals}
              variableMode={variableMode}
              tierDiscounts={tierDiscounts}
            />
          )}
          
          {discountType === DiscountType.FREE_PRODUCT && (
            <FreeProductDiscount 
              rows={rows}
              buyAmount={buyAmount}
              getAmount={getAmount}
              setRows={setRows}
              setTotals={setTotals}
            />
          )}
          
          {/* Show either ProductTable or TipCalculator based on discount type */}
          {discountType === DiscountType.TIP_CALCULATION ? (
            <TipCalculator 
              setTotals={setTotals}
            />
          ) : (
            <ProductTable 
              rows={rows}
              totals={totals}
              discountType={discountType}
              setRows={setRows}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;