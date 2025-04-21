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
    console.log ('use effect free', {rows, buyAmount, getAmount})
    if (!buyAmount || !getAmount || rows.length === 0) return;

    const buyAmountNum = parseInt(buyAmount, 10);
    const getAmountNum = parseInt(getAmount, 10);
    
    if (isNaN(buyAmountNum) || isNaN(getAmountNum) || buyAmountNum <= 0 || getAmountNum <= 0) return;

  // Check if any rows have prices but no discount calculations yet
  const needsCalculation = rows.some(row => 
    row.price && !isNaN(parseFloat(row.price)) && 
    (row.discount === '' || row.finalPrice === '')
    );
   // Only perform calculations if needed
    if (!needsCalculation) return;

    // Track if we're making substantial changes to avoid infinite loops
    let hasChanges = false;

    // Filter rows that have valid prices
    const validRows = rows.filter(row => row.price && !isNaN(parseFloat(row.price)));
    
    if (validRows.length === 0) {
      // If there are no valid rows but we have rows with empty discounts, update them
      const needsReset = rows.some(row => row.discount !== '' || row.finalPrice !== row.price);
      
      if (needsReset) {
        const resetRows = rows.map(row => ({
          ...row,
          discount: '',
          finalPrice: row.price
        }));
        setRows(resetRows);
        setTotals(calculateTotals(resetRows));
      }
      return;
    }

    // Sort rows by price in ascending order (cheapest first)
    const sortedRows = [...validRows].sort((a, b) => 
      parseFloat(a.price) - parseFloat(b.price)
    );

    // Create a map of row IDs to their current values for quick lookup
    const rowMap = new Map(rows.map(row => [row.id, row]));
    
    // Initialize updatedRows with a copy of the current rows
    const updatedRows = [...rows];

    // Calculate group size
    const groupSize = buyAmountNum + getAmountNum;
    
    // First reset all discounts to default values
    updatedRows.forEach((row, idx) => {
      if (row.price) {
        const currentDiscount = row.discount;
        const currentFinalPrice = row.finalPrice;
        
        // Set default values (no discount)
        updatedRows[idx] = {
          ...row,
          discount: '0',
          finalPrice: row.price
        };
        
        // Check if this is a change
        if (currentDiscount !== '0' || currentFinalPrice !== row.price) {
          hasChanges = true;
        }
      }
    });

    // Track which items should get discounts
    const discountTargets = new Set<number>();
    
    // Calculate how many complete groups we have
    const completeGroups = Math.floor(sortedRows.length / groupSize);
    
    // For each complete group
    for (let i = 0; i < completeGroups; i++) {
      // Get the current group's items
      const startIdx = i * groupSize;
      
      // Mark the cheapest getAmountNum items in each group for discount
      for (let j = 0; j < getAmountNum; j++) {
        if (startIdx + j < sortedRows.length) {
          discountTargets.add(sortedRows[startIdx + j].id);
        }
      }
    }
    
    // Handle remaining items
    const remainingItems = sortedRows.length % groupSize;
    const remainingStartIdx = completeGroups * groupSize;
    
    // If we have more items than buyAmount in the remaining group
    if (remainingItems > buyAmountNum) {
      // Find how many items qualify for the discount
      const remainingDiscounts = Math.min(remainingItems - buyAmountNum, getAmountNum);
      
      // Mark the cheapest remainingDiscounts items for discount
      for (let j = 0; j < remainingDiscounts; j++) {
        if (remainingStartIdx + j < sortedRows.length) {
          discountTargets.add(sortedRows[remainingStartIdx + j].id);
        }
      }
    }
    
    // Apply 100% discount to all marked items
    discountTargets.forEach(id => {
      const rowIndex = updatedRows.findIndex(r => r.id === id);
      if (rowIndex !== -1) {
        const currentDiscount = updatedRows[rowIndex].discount;
        const currentFinalPrice = updatedRows[rowIndex].finalPrice;
        
        updatedRows[rowIndex].discount = '100';
        updatedRows[rowIndex].finalPrice = '0';
        
        // Check if this is a change
        if (currentDiscount !== '100' || currentFinalPrice !== '0') {
          hasChanges = true;
        }
      }
    });

    // Only update state if there were actual changes
    if (hasChanges) {
      setRows(updatedRows);
      setTotals(calculateTotals(updatedRows));
    }
  }, [rows, buyAmount, getAmount, setRows, setTotals]);

  return null; // This component doesn't render anything, it just handles logic
};

export default FreeProductDiscount;