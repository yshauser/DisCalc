// src/components/TipCalculator.tsx

import React, { useState, useEffect } from 'react';
import { Totals } from '../models/types';

const DEFAULT_TIP = '';

interface TipCalculatorProps {
  setTotals: React.Dispatch<React.SetStateAction<Totals>>;
}

const TipCalculator: React.FC<TipCalculatorProps> = ({ setTotals }) => {
  const [price, setPrice] = useState<string>('');
  const [tipPercentage, setTipPercentage] = useState<string>(DEFAULT_TIP);
  const [tipPayment, setTipPayment] = useState<string>(DEFAULT_TIP);
  const [payment, setPayment] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<'price' | 'tipPercentage' | 'tipPayment' | 'payment' | null>(null);
console.log ('in tip calculator')
  // Calculate based on which fields were updated
  useEffect(() => {
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) return
    if (lastUpdated === 'price' || lastUpdated === 'tipPercentage') {
      if (tipPercentage && !isNaN(parseFloat(tipPercentage))) {
        const priceValue = parseFloat(price);
        const tipPercentageValue = parseFloat(tipPercentage);
        const calculatedPayment = priceValue * (1 + tipPercentageValue / 100);
        setTipPayment((calculatedPayment-priceValue).toFixed(2));
        setPayment(calculatedPayment.toFixed(2));
      }
    
    } 
    else if (lastUpdated === 'tipPayment') {
      if (tipPayment && !isNaN(parseFloat(tipPayment))) {
        const priceValue = parseFloat(price);
        const tipPaymentValue = parseFloat(tipPayment);
        const calculatedPayment = priceValue + tipPaymentValue;
        const tipPercentageValue = (tipPaymentValue * 100)/priceValue
        setTipPercentage(tipPercentageValue.toFixed(2));
        setPayment(calculatedPayment.toFixed(2));
      }
    } else if (lastUpdated === 'payment') {
      if (payment && !isNaN(parseFloat(payment))) {
        const priceValue = parseFloat(price);
        const paymentValue = parseFloat(payment);
        
        if (paymentValue > priceValue) {
          const calculatedTip = ((paymentValue - priceValue) * 100) / priceValue;
          setTipPercentage(calculatedTip.toFixed(2));
          setTipPayment((paymentValue-priceValue).toFixed(2));
        } else {
          setTipPercentage('0');
          setTipPayment('0');
        }
      }
    }

    // Update totals
    if (price) {
      setTotals({
        price: price,
        discount: tipPercentage || '0',
        finalPrice: payment || price
      });
    }
  }, [price, tipPercentage, tipPayment, payment, lastUpdated, setTotals]);

  const handlePriceChange = (value: string) => {
    setPrice(value);
    setLastUpdated('price');
  };

  const handleTipPercentChange = (value: string) => {
    setTipPercentage(value);
    setLastUpdated('tipPercentage');
  };

  const handleTipPaymentChange = (value: string) => {
    setTipPayment(value);
    setLastUpdated('tipPayment');
  };

  const handlePaymentChange = (value: string) => {
    setPayment(value);
    setLastUpdated('payment');
  };

  return (
    <div className="tip-calculator">
      <div className="calculator-instruction">
        הכניסו אחוז טיפ, סכום טיפ או סכום כולל לתשלום
      </div>
      
      <div className="tip-calculator-fields">
        <div className="calculator-field">
          <label>חשבון</label>
          <div className="input-wrapper">
            <input
              type="number"
              value={price}
              onChange={(e) => handlePriceChange(e.target.value)}
              className="form-control"
              placeholder="הזן מחיר"
              min="0"
              step="0.01"
            />
            <span className="input-addon">₪</span>
          </div>
        </div>
        
        <div className="calculator-field">
          <label>טיפ (%) </label>
          <div className="input-wrapper">
            <input
              type="number"
              value={tipPercentage}
              onChange={(e) => handleTipPercentChange(e.target.value)}
              className="form-control"
              placeholder="הזן אחוז טיפ"
              min="0"
              step="0.5"
            />
            <span className="input-addon">%</span>
          </div>
        </div>

        <div className="calculator-field">
          <label>טיפ (₪)</label>
          <div className="input-wrapper">
            <input
              type="number"
              value={tipPayment}
              onChange={(e) => handleTipPaymentChange(e.target.value)}
              className="form-control"
              placeholder="הזן סכום טיפ"
              min="0"
              step="0.5"
            />
            <span className="input-addon">₪</span>
          </div>
        </div>
        
        <div className="calculator-field">
          <label>לתשלום</label>
          <div className="input-wrapper">
            <input
              type="number"
              value={payment}
              onChange={(e) => handlePaymentChange(e.target.value)}
              className="form-control"
              placeholder="סכום לתשלום"
              min="0"
              step="0.01"
            />
            <span className="input-addon">₪</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipCalculator;