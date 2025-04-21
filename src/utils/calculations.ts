// src/utils/calculations.ts

import { ProductRow, Totals } from '../models/types';

// Calculate final price based on price and discount percentage
export const calculateFinalPrice = (price: string, discount: string): string => {
  const priceNum = parseFloat(price);
  const discountNum = parseFloat(discount);
  
  if (!isNaN(priceNum) && !isNaN(discountNum)) {
    return (priceNum * ((100 - discountNum) / 100)).toFixed(2);
  }
  return '';
};

// Calculate totals from all rows
export const calculateTotals = (rows: ProductRow[]): Totals => {
  let totalPrice = 0;
  let totalFinalPrice = 0;
  
  rows.forEach(row => {
    const price = parseFloat(row.price);
    const finalPrice = parseFloat(row.finalPrice);
    
    if (!isNaN(price)) {
      totalPrice += price;
    }
    
    if (!isNaN(finalPrice)) {
      totalFinalPrice += finalPrice;
    }
  });
  
  let totalDiscount = 0;
  if (totalPrice > 0 && totalFinalPrice > 0) {
    totalDiscount = 100 - ((totalFinalPrice * 100) / totalPrice);
  }
  
  return {
    price: totalPrice.toFixed(2),
    discount: totalDiscount.toFixed(2),
    finalPrice: totalFinalPrice.toFixed(2)
  };
};