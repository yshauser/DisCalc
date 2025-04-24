import React, { useEffect, useRef } from 'react';
import { ProductRow, Totals } from '../models/types';

interface QuantityDiscountProps {
  rows: ProductRow[];
  priceForSingle: string;
  priceForMultiple: string;
  quantityInGroup: string;
  setRows: React.Dispatch<React.SetStateAction<ProductRow[]>>;
  setTotals: React.Dispatch<React.SetStateAction<Totals>>;
}

const QuantityDiscount: React.FC<QuantityDiscountProps> = ({
  rows,
  priceForSingle,
  priceForMultiple,
  quantityInGroup,
  setRows,
  setTotals
}) => {
//   console.log('in quantity discount', { rows, priceForSingle, priceForMultiple, quantityInGroup });
  
  // Use ref to track previous values to avoid unnecessary updates
  const prevValuesRef = useRef({
    rowsLength: 0,
    priceForSingle: '',
    priceForMultiple: '',
    quantityInGroup: '',
    rowPrices: [] as string[]
  });

  useEffect(() => {
    // Only run the effect if priceForSingle actually changed
    if (prevValuesRef.current.priceForSingle !== priceForSingle) {
      if (priceForSingle && priceForSingle !== '' && rows.length === 1 && priceForSingle !== rows[0].price) {
        const needsUpdate = rows.some(row => row.price !== priceForSingle);      
        if (needsUpdate) {
          setRows(prevRows =>
            prevRows.map(row => ({
              ...row,
              price: priceForSingle
            }))
          );
        }
      }
      
      // Update the ref
      prevValuesRef.current.priceForSingle = priceForSingle;
    }
  }, [priceForSingle, rows]);

  // Apply the "Quantity Discount" logic
  useEffect(() => {
    const qtyInGroup = parseInt(quantityInGroup, 10);
    console.log ('quan', {qtyInGroup})
    
    if (
      isNaN(qtyInGroup) || 
      qtyInGroup <= 0 || 
      rows.length === 0 ||
      priceForSingle === '' ||
      priceForMultiple === ''
    ) return;

    // Check if any values have changed
    const rowPrices = rows.map(row => row.price);
    const pricesChanged = JSON.stringify(prevValuesRef.current.rowPrices) !== JSON.stringify(rowPrices);

    const valuesChanged = 
      prevValuesRef.current.rowsLength !== rows.length ||
      prevValuesRef.current.priceForSingle !== priceForSingle ||
      prevValuesRef.current.priceForMultiple !== priceForMultiple ||
      prevValuesRef.current.quantityInGroup !== quantityInGroup ||
      pricesChanged;
    
    if (!valuesChanged) return;
    
    // Sort rows from most expensive to cheapest
    const sortedRows = [...rows].sort((a, b) => {
      const priceA = a.price === '' ? 0 : parseFloat(a.price);
      const priceB = b.price === '' ? 0 : parseFloat(b.price);
      return priceB - priceA;
    });

    // Mark group starts and reset discounts/finalPrices
    const updatedRows = sortedRows.map((row, index) => {
      return {
        ...row,
        discount: '',
        finalPrice: '',
        isGroupStart: index % qtyInGroup === 0
      };
    });

    // Calculate totals
    const fullGroupCount = Math.floor(updatedRows.length / qtyInGroup);
    let totalPrice = 0;
    
    // Add price for each full group
    totalPrice += fullGroupCount * parseFloat(priceForMultiple || '0');
    
    // Add individual prices for remaining items
    const remainingItems = updatedRows.length % qtyInGroup;
    for (let i = fullGroupCount * qtyInGroup; i < updatedRows.length; i++) {
      totalPrice += parseFloat(updatedRows[i].price || '0');
    }
    
    // Calculate discount percentage
    const originalTotal = updatedRows.reduce((sum, row) => 
      sum + parseFloat(row.price || '0'), 0);
    
    const discountAmount = originalTotal - totalPrice;
    const discountPercentage = originalTotal > 0 ? 
      (discountAmount / originalTotal) * 100 : 0;
    
    // Update the refs for next comparison
    prevValuesRef.current = {
      rowsLength: rows.length,
      priceForSingle,
      priceForMultiple,
      quantityInGroup,
      rowPrices
    };

    // Update state
    setRows(updatedRows);
    setTotals({
      price: originalTotal.toFixed(2),
      discount: discountPercentage.toFixed(2),
      finalPrice: totalPrice.toFixed(2)
    });
    console.log ('rows ', {updatedRows})
  }, [rows, priceForSingle, priceForMultiple, quantityInGroup, setRows, setTotals]);
  
  return null; // This component doesn't render anything, it just handles logic
};

export default QuantityDiscount;