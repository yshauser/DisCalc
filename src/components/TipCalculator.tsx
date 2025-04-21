// src/components/TipCalculator.tsx

import React, { useState, useEffect } from 'react';
import { Totals } from '../models/types';

const DEFAULT_TIP = '';

interface TipCalculatorProps {
  setTotals: React.Dispatch<React.SetStateAction<Totals>>;
}

const TipCalculator: React.FC<TipCalculatorProps> = ({ setTotals }) => {
  const [price, setPrice] = useState<string>('');
  const [tip, setTip] = useState<string>(DEFAULT_TIP);
  const [payment, setPayment] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<'price' | 'tip' | 'payment' | null>(null);

  // Calculate based on which fields were updated
  useEffect(() => {
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) return;

    if (lastUpdated === 'price' || lastUpdated === 'tip') {
      if (tip && !isNaN(parseFloat(tip))) {
        const priceValue = parseFloat(price);
        const tipValue = parseFloat(tip);
        const calculatedPayment = priceValue * (1 + tipValue / 100);
        setPayment(calculatedPayment.toFixed(2));
      }
    } else if (lastUpdated === 'payment') {
      if (payment && !isNaN(parseFloat(payment))) {
        const priceValue = parseFloat(price);
        const paymentValue = parseFloat(payment);
        
        if (paymentValue > priceValue) {
          const calculatedTip = ((paymentValue - priceValue) * 100) / priceValue;
          setTip(calculatedTip.toFixed(2));
        } else {
          setTip('0');
        }
      }
    }

    // Update totals
    if (price) {
      setTotals({
        price: price,
        discount: tip || '0',
        finalPrice: payment || price
      });
    }
  }, [price, tip, payment, lastUpdated, setTotals]);

  const handlePriceChange = (value: string) => {
    setPrice(value);
    setLastUpdated('price');
  };

  const handleTipChange = (value: string) => {
    setTip(value);
    setLastUpdated('tip');
  };

  const handlePaymentChange = (value: string) => {
    setPayment(value);
    setLastUpdated('payment');
  };

  return (
    <div className="tip-calculator">
      <div className="calculator-instruction">
        הכנס טיפ לחישוב התשלום או הכנס תשלום לחישוב הטיפ
      </div>
      
      <div className="tip-calculator-fields">
        <div className="calculator-field">
          <label>מחיר</label>
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
          <label>טיפ</label>
          <div className="input-wrapper">
            <input
              type="number"
              value={tip}
              onChange={(e) => handleTipChange(e.target.value)}
              className="form-control"
              placeholder="הזן אחוז טיפ"
              min="0"
              step="0.5"
            />
            <span className="input-addon">%</span>
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