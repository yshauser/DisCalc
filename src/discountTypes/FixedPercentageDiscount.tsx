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
    // console.log ('price2', rows)

    if (fixedDiscount) {
      setRows(prevRows => 
        prevRows.map(row => {
          const updatedRow = { ...row, discount: fixedDiscount };
          const priceValue = row.price === '' ? '0' : row.price;
          updatedRow.finalPrice = calculateFinalPrice(priceValue, fixedDiscount);

          return updatedRow;
        })
      );
    }
  }, [fixedDiscount, setRows]);


    // Separate effect to handle price changes in rows
    useEffect(() => {
      if (fixedDiscount) {
        // Only update specific rows where price exists but finalPrice doesn't match what it should be
        const needsUpdate = rows.some(row => {
          const priceValue = row.price === '' ? '0' : row.price;
          const expectedFinalPrice = calculateFinalPrice(priceValue, fixedDiscount);
          return row.finalPrice !== expectedFinalPrice;
        });
  
        if (needsUpdate) {
          setRows(prevRows =>
            prevRows.map(row => {
              const priceValue = row.price === '' ? '0' : row.price;
              return {
                ...row,
                discount: fixedDiscount,
                finalPrice: calculateFinalPrice(priceValue, fixedDiscount)
              };
            })
          );
        }
      }
    }, [rows, fixedDiscount, setRows]);


  // Calculate totals when rows change
  useEffect(() => {
        // Create a copy of rows with empty prices converted to '0' for total calculation
        const rowsForTotals = rows.map(row => ({
          ...row,
          price: row.price === '' ? '0' : row.price,
          finalPrice: row.finalPrice === '' ? '0' : row.finalPrice
        }));
    setTotals(calculateTotals(rows));
  }, [rows, setTotals]);

  return null; // This component doesn't render anything, it just handles logic
};

export default FixedPercentageDiscount;