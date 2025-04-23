// src/discountTypes/VariablePercentageDiscount.tsx

import React, { useEffect } from 'react';
import { ProductRow, Totals } from '../models/types';
import { calculateTotals } from '../utils/calculations';

interface VariablePercentageDiscountProps {
  rows: ProductRow[];
  setRows: React.Dispatch<React.SetStateAction<ProductRow[]>>;
  setTotals: React.Dispatch<React.SetStateAction<Totals>>;
  variableMode: 'free' | 'tiered';
  tierDiscounts: string[];
}

const VariablePercentageDiscount: React.FC<VariablePercentageDiscountProps> = ({
  rows,
  setRows,
  setTotals,
  variableMode,
  tierDiscounts
}) => {
  // Calculate totals when rows change
  useEffect(() => {
    setTotals(calculateTotals(rows));
  }, [rows, setTotals]);

// Apply tiered discounts when in 'tiered' mode
useEffect(() => {
  if (variableMode !== 'tiered' || rows.length === 0 || tierDiscounts.length === 0) return;

  // Sort rows from most expensive to cheapest
  const sortedRows = [...rows].sort((a, b) =>
    parseFloat(b.price) - parseFloat(a.price)
  );

  const updatedRows = sortedRows.map((row, index) => {
    // Determine which tier discount to apply
    const tierIndex = Math.min(index, tierDiscounts.length - 1);
    const discountValue = tierDiscounts[tierIndex] || '0';

    // Skip empty discount values or non-numeric values
    const parsedDiscount = parseFloat(discountValue);
    const newDiscount = !isNaN(parsedDiscount) ? discountValue : '0';

    // Calculate the final price based on the discount
    const price = parseFloat(row.price);
    const discountAmount = price * (parsedDiscount / 100);
    const newFinalPrice = !isNaN(discountAmount) ? (price - discountAmount).toFixed(2) : row.price;

    return {
      ...row,
      discount: newDiscount,
      finalPrice: newFinalPrice
    };
  });

  // Compare to existing rows — if all discounts/finalPrices match, don't update
  const isEqual = rows.every((row, index) =>
    row.discount === updatedRows[index].discount &&
    row.finalPrice === updatedRows[index].finalPrice
  );

  if (!isEqual) {
    setRows(updatedRows);
    setTotals(calculateTotals(updatedRows));
  }
}, [rows, variableMode, tierDiscounts, setRows, setTotals]);


  return null; // This component doesn't render anything, it just handles logic
};

export default VariablePercentageDiscount;