//src/discountTypes/FreeProductDiscount.tsx
import React, { useEffect } from 'react';
import { ProductRow, Totals } from '../models/types';
import { calculateTotals } from '../utils/calculations';

interface FreeProductDiscountProps {
  rows: ProductRow[];
  buyAmount: string;
  getAmount: string;
  setRows: React.Dispatch<React.SetStateAction<ProductRow[]>>;
  setTotals: React.Dispatch<React.SetStateAction<Totals>>;
}

const FreeProductDiscount: React.FC<FreeProductDiscountProps> = ({
  rows,
  buyAmount,
  getAmount,
  setRows,
  setTotals
}) => {
  // Apply the "Buy X Get Y Free" discount logic
  useEffect(() => {
    const buyAmountNum = parseInt(buyAmount, 10);
    const getAmountNum = parseInt(getAmount, 10);
  
    if (
      isNaN(buyAmountNum) || isNaN(getAmountNum) ||
      buyAmountNum <= 0 || getAmountNum <= 0 ||
      rows.length === 0
    ) return;
  
    const sortedRows = [...rows].sort((a, b) =>
      parseFloat(b.price) - parseFloat(a.price)
    );
  
    const groupSize = buyAmountNum + getAmountNum;
  
    const updatedRows = sortedRows.map((row, index) => {
      const positionInGroup = index % groupSize;
      const shouldBeFree = positionInGroup >= buyAmountNum;
      const newDiscount = shouldBeFree ? '100' : '0';
      const newFinalPrice = shouldBeFree ? '0' : row.price;
  
      return {
        ...row,
        discount: newDiscount,
        finalPrice: newFinalPrice,
        // isGroupStart: positionInGroup === 0, // 👈 mark group start
        isGroupStart: index % groupSize === 0
      };
    });
  
    // Compare to existing rows — if all discounts/finalPrices match, don't update
    const isEqual = rows.every((row, idx) =>
      row.discount === updatedRows[idx].discount &&
      row.finalPrice === updatedRows[idx].finalPrice
    );
  
    if (!isEqual) {
      setRows(updatedRows);
      setTotals(calculateTotals(updatedRows));
    }
  }, [rows, buyAmount, getAmount, setRows, setTotals]);
  
  return null; // This component doesn't render anything, it just handles logic
};

export default FreeProductDiscount;