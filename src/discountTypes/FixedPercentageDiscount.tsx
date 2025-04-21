// src/discountTypes/FixedPercentageDiscount.tsx

import React, { useEffect } from 'react';
import { ProductRow, Totals } from '../models/types';
import { calculateFinalPrice, calculateTotals } from '../utils/calculations';

interface FixedPercentageDiscountProps {
  rows: ProductRow[];
  fixedDiscount: string;
  setRows: React.Dispatch<React.SetStateAction<ProductRow[]>>;
  setTotals: React.Dispatch<React.SetStateAction<Totals>>;
}

const FixedPercentageDiscount: React.FC<FixedPercentageDiscountProps> = ({
  rows,
  fixedDiscount,
  setRows,
  setTotals
}) => {
  // Apply fixed discount to all rows when fixedDiscount changes
  useEffect(() => {
    if (fixedDiscount) {
      setRows(prevRows => 
        prevRows.map(row => {
          const updatedRow = { ...row, discount: fixedDiscount };
          
          if (row.price) {
            updatedRow.finalPrice = calculateFinalPrice(row.price, fixedDiscount);
          }
          
          return updatedRow;
        })
      );
    }
  }, [fixedDiscount, setRows]);

  // Calculate totals when rows change
  useEffect(() => {
    setTotals(calculateTotals(rows));
  }, [rows, setTotals]);

  return null; // This component doesn't render anything, it just handles logic
};

export default FixedPercentageDiscount;