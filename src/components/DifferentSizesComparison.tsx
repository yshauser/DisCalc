// src/components/DifferentSizesComparison.tsx

import React, { useState, useEffect } from 'react';
import { ProductRow } from '../models/types';
import './Table.css';

interface ExtendedProductRow extends ProductRow {
  productSize?: string;
  productUnit?: 'גרם' | 'ק"ג' | 'מ"ל' | 'ליטר';
  standardizedPrice?: string;
  hasBetterPrice?: boolean;
}

interface DifferentSizesComparisonProps {
  rows: ProductRow[];
  setRows: React.Dispatch<React.SetStateAction<ProductRow[]>>;
}

const DifferentSizesComparison: React.FC<DifferentSizesComparisonProps> = ({
  rows,
  setRows
}) => {
  
  // Ensure we have exactly 2 rows for this comparison mode
  useEffect(() => {
    if (rows.length !== 2) {
      const newRows: ExtendedProductRow[] = [];
      
      // Keep existing rows if available
      for (let i = 0; i < Math.min(rows.length, 2); i++) {
        const existingRow = rows[i] as ExtendedProductRow;
        newRows.push({
          ...existingRow,
          amount: existingRow.amount || '1',
          price: existingRow.price || '',
          productUnit: existingRow.productUnit || 'גרם',
          productSize: existingRow.productSize || '100'
        });
      }
      
      // Add new rows if needed
      for (let i = newRows.length; i < 2; i++) {
        newRows.push({
          id: i + 1,
          amount: '1',
          price: '',
          discount: '',
          finalPrice: '',
          productUnit: 'גרם',
          productSize: '100'
        });
      }
      
      setRows(newRows);
    }
  }, []);

  // Handle input change for any field
  const handleInputChange = (
    rowIndex: number, 
    field: 'amount' | 'price' | 'productUnit' | 'productSize', 
    value: string
  ) => {
    setRows(prevRows => {
      const newRows = [...prevRows];
      const updatedRow = { 
        ...newRows[rowIndex], 
        [field]: value 
      } as ExtendedProductRow;

    // Special handling for productUnit changes
    if (field === 'productUnit') {
      const otherRowIndex = rowIndex === 0 ? 1 : 0;
      const otherRow = newRows[otherRowIndex] as ExtendedProductRow;
      
      // Auto-adjust product size based on unit type
      if ((value === 'גרם' || value === 'מ"ל') && updatedRow.productSize === '1') {
        updatedRow.productSize = '100';
      } else if ((value === 'ליטר' || value === 'ק"ג') && updatedRow.productSize === '100') {
        updatedRow.productSize = '1';
      }
      
      // Handle unit type synchronization between the two products
      const isSolidType = (unit?: string) => unit === 'גרם' || unit === 'ק"ג';
      const isLiquidType = (unit?: string) => unit === 'מ"ל' || unit === 'ליטר';
      
      // Check if the units are in different categories (solid vs liquid)
      if ((isSolidType(value) && isLiquidType(otherRow.productUnit)) || 
          (isLiquidType(value) && isSolidType(otherRow.productUnit))) {
        // Synchronize the other row's unit to match this row's category
        otherRow.productUnit = value;
        
        // Also adjust the other row's product size if needed
        if ((value === 'גרם' || value === 'מ"ל') && otherRow.productSize === '1') {
          otherRow.productSize = '100';
        } else if ((value === 'ליטר' || value === 'ק"ג') && otherRow.productSize === '100') {
          otherRow.productSize = '1';
        }
      }
    }
      
      // Calculate standardized price
      if (updatedRow.price && updatedRow.amount && updatedRow.productSize) {
        const price = parseFloat(updatedRow.price);
        const amount = parseFloat(updatedRow.amount);
        const productSize = parseFloat(updatedRow.productSize);
      
        
        if (amount > 0 && productSize > 0) {
          // Calculate price per unit
          updatedRow.pricePerUnit = (price / amount).toFixed(2);
          
          // Determine the standardized amount based on unit
          const standardAmount = (updatedRow.productUnit === 'גרם' || updatedRow.productUnit === 'מ"ל') ? 100 : 1;
          
          // Get the other row to check for unit differences
          const otherRowIndex = rowIndex === 0 ? 1 : 0;
          const otherRow = newRows[otherRowIndex] as ExtendedProductRow;
        
          let adjustedProductSize = productSize;

          // Check if units are different between rows and apply conversion
          if (otherRow.productUnit !== updatedRow.productUnit) {
            // If the first column (rowIndex 0) has small units (grams, ml) and this row has large units (kg, liter)
            if (rowIndex === 1 && (updatedRow.productUnit === 'ליטר' || updatedRow.productUnit === 'ק"ג') && 
                (otherRow.productUnit === 'גרם' || otherRow.productUnit === 'מ"ל')) {
              // Multiply by 1000 for conversion
              adjustedProductSize = productSize * 10;
            }
            // If the first column (rowIndex 0) has large units (kg, liter) and this row has small units (grams, ml)
            else if (rowIndex === 1 && (updatedRow.productUnit === 'גרם' || updatedRow.productUnit === 'מ"ל') && 
                    (otherRow.productUnit === 'ליטר' || otherRow.productUnit === 'ק"ג')) {
              // Divide by 1000 for conversion
              adjustedProductSize = productSize / 10;
            }
          }
          
          // Calculate standardized price (price per standard amount)
          updatedRow.standardizedPrice = ((parseFloat(updatedRow.pricePerUnit) * standardAmount) / adjustedProductSize).toFixed(2);

                  // After calculating the standardized price, update the hasBetterPrice flag for both rows
        if (otherRow.standardizedPrice) {
          const currentPrice = parseFloat(updatedRow.standardizedPrice);
          const otherPrice = parseFloat(otherRow.standardizedPrice);
          
          if (!isNaN(currentPrice) && !isNaN(otherPrice)) {
            // Set hasBetterPrice flag - true means this row has the lower price (better deal)
            updatedRow.hasBetterPrice = currentPrice < otherPrice;
            otherRow.hasBetterPrice = otherPrice < currentPrice;
            
            // If prices are equal, neither has a better price
            if (currentPrice === otherPrice) {
              updatedRow.hasBetterPrice = false;
              otherRow.hasBetterPrice = false;
            }
          }
        }
        } else {
          updatedRow.pricePerUnit = '';
          updatedRow.standardizedPrice = '';
          updatedRow.hasBetterPrice = false;
        }
      } else {
        updatedRow.pricePerUnit = '';
        updatedRow.standardizedPrice = '';
        updatedRow.hasBetterPrice = false;
      }
      
      newRows[rowIndex] = updatedRow;
      return newRows;
    });
  };

  // Get the unit for displaying standardized price (e.g., "100 גרם")
  const getStandardizedUnit = (rowIndex: number): { amount: number, unit: string } => {
    const productUnit = (rows[rowIndex] as ExtendedProductRow).productUnit || 'גרם';
    
    if (productUnit === 'גרם' || productUnit === 'מ"ל') {
      return { amount: 100, unit: productUnit };
    } else {
      return { amount: 1, unit: productUnit };
    }
  };

  const product1StandardUnit = getStandardizedUnit(0);
  const product2StandardUnit = getStandardizedUnit(1);

  return (
    <div className="calculator-table different-sizes-comparison">
      <table className="product-table">
        <thead>
          <tr>
            <th></th>
            <th>מוצר 1</th>
            <th>מוצר 2</th>
          </tr>
        </thead>
        <tbody>
          {/* Amount Row */}
          <tr>
            <td className="row-label">כמות</td>
            <td className="col-amount">
              <div className="amount-input-group">
                <select
                  value={(rows[0] as ExtendedProductRow).amount || '1'}
                  onChange={(e) => handleInputChange(0, 'amount', e.target.value)}
                  className="form-control"
                >
                  {Array.from({length: 10}, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                {/* <span className="amount-text">ב-</span> */}
              </div>
            </td>
            <td>
              <div className="amount-input-group">
                <select
                  value={(rows[1] as ExtendedProductRow).amount || '1'}
                  onChange={(e) => handleInputChange(1, 'amount', e.target.value)}
                  className="form-control"
                >
                  {Array.from({length: 10}, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                {/* <span className="amount-text">ב-</span> */}
              </div>
            </td>
          </tr>
          
          {/* Price Row */}
          <tr>
            <td className="row-label">מחיר</td>
            <td className="col-price">
              <div className="input-wrapper">
                <input
                  type="number"
                  value={(rows[0] as ExtendedProductRow).price || ''}
                  onChange={(e) => handleInputChange(0, 'price', e.target.value)}
                  className="form-control"
                  min="0"
                />
                <span className="input-addon">₪</span>
              </div>
            </td>
            <td className="col-price">
              <div className="input-wrapper">
                <input
                  type="number"
                  value={(rows[1] as ExtendedProductRow).price || ''}
                  onChange={(e) => handleInputChange(1, 'price', e.target.value)}
                  className="form-control"
                  min="0"
                />
                <span className="input-addon">₪</span>
              </div>
            </td>
          </tr>
          
          {/* Unit Row */}
          <tr>
            <td className="row-label">יחידת מידה</td>
            <td>
              <select
                value={(rows[0] as ExtendedProductRow).productUnit || 'גרם'}
                onChange={(e) => handleInputChange(0, 'productUnit', e.target.value)}
                className="form-control"
              >
                <option value="גרם">גרם</option>
                <option value="ק&quot;ג">ק"ג</option>
                <option value="מ&quot;ל">מ"ל</option>
                <option value="ליטר">ליטר</option>
              </select>
            </td>
            <td>
              <select
                value={(rows[1] as ExtendedProductRow).productUnit || 'גרם'}
                onChange={(e) => handleInputChange(1, 'productUnit', e.target.value)}
                className="form-control"
              >
                <option value="גרם">גרם</option>
                <option value="ק&quot;ג">ק"ג</option>
                <option value="מ&quot;ל">מ"ל</option>
                <option value="ליטר">ליטר</option>
              </select>
            </td>
          </tr>
          
          {/* Product Size Row */}
          <tr>
            <td className="row-label">גודל מוצר</td>
            <td>
              <div className="input-wrapper">
                <input
                  type="number"
                  value={(rows[0] as ExtendedProductRow).productSize || ''}
                  onChange={(e) => handleInputChange(0, 'productSize', e.target.value)}
                  className="form-control"
                  min="0"
                />
              </div>
            </td>
            <td>
              <div className="input-wrapper">
                <input
                  type="number"
                  value={(rows[1] as ExtendedProductRow).productSize || ''}
                  onChange={(e) => handleInputChange(1, 'productSize', e.target.value)}
                  className="form-control"
                  min="0"
                />
              </div>
            </td>
          </tr>
          
          {/* Standardized Price Row */}
          <tr>
            <td className="row-label">
              מחיר ל-{product1StandardUnit.amount} {product1StandardUnit.unit}
            </td>
            <td>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={(rows[0] as ExtendedProductRow).standardizedPrice || ''}
                  readOnly
                  className={`form-control readonly ${(rows[0] as ExtendedProductRow).hasBetterPrice ? 'better-price' : ''}`}
                  />
                <span className="input-addon">₪</span>
              </div>
            </td>
            <td>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={(rows[1] as ExtendedProductRow).standardizedPrice || ''}
                  readOnly
                  className={`form-control readonly ${(rows[1] as ExtendedProductRow).hasBetterPrice ? 'better-price' : ''}`}
                  />
                <span className="input-addon">₪</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DifferentSizesComparison;