// src/discountTypes/VariablePercentageDiscount.tsx

import React, { useEffect } from 'react';
import { ProductRow, Totals } from '../models/types';
import { calculateTotals } from '../utils/calculations';

interface VariablePercentageDiscountProps {
  rows: ProductRow[];
  setTotals: React.Dispatch<React.SetStateAction<Totals>>;
}

const VariablePercentageDiscount: React.FC<VariablePercentageDiscountProps> = ({
  rows,
  setTotals
}) => {
  // Calculate totals when rows change
  useEffect(() => {
    setTotals(calculateTotals(rows));
  }, [rows, setTotals]);

  return null; // This component doesn't render anything, it just handles logic
};

export default VariablePercentageDiscount;