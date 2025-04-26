// src/components/QuantityComparison.tsx

import React from 'react';
import { ProductRow, Totals, DiscountType } from '../models/types';
import '../components/Table.css';

interface QuantityComparisonProps {
  rows: ProductRow[];
  setRows: React.Dispatch<React.SetStateAction<ProductRow[]>>;
  comparisonMode: 'identical' | 'different';
}

const QuantityComparison: React.FC<QuantityComparisonProps> = ({
  rows,
  setRows,
  comparisonMode
}) => {
  // Handle input change for amount or price
  const handleInputChange = (id: number, field: 'amount' | 'price', value: string) => {
    setRows(prevRows => {
      return prevRows.map(row => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: value };
          
          // Calculate price per unit
          if (updatedRow.price && updatedRow.amount) {
            const price = parseFloat(updatedRow.price);
            const amount = parseFloat(updatedRow.amount);
            if (amount > 0) {
              updatedRow.pricePerUnit = (price / amount).toFixed(2);
            } else {
              updatedRow.pricePerUnit = '';
            }
          } else {
            updatedRow.pricePerUnit = '';
          }
          
          return updatedRow;
        }
        return row;
      });
    });
  };

  // Add a new row
  const addRow = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map(row => row.id)) + 1 : 1;
    const newRow = { 
      id: newId, 
      price: '', 
      amount: '1', // Default amount is 1
      pricePerUnit: '',
      discount: '', // Not used in this component but required by ProductRow type
      finalPrice: '' // Not used in this component but required by ProductRow type
    };
    
    setRows([...rows, newRow]);
  };

  // Remove a row
  const removeRow = (id: number) => {
    if (rows.length > 2) { // Keep minimum 2 rows
      setRows(rows.filter(row => row.id !== id));
    }
  };

  return (
    <div className="calculator-table">
      <table className="product-table">
        <thead>
          <tr>
            <th className="col-amount">כמות</th>
            <th className="col-price">מחיר</th>
            <th className="col-price-per-unit">מחיר ליחידה</th>
            <th className="col-action"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="col-amount">
                <div className="amount-input-group">
                  <select
                    value={row.amount || '1'}
                    onChange={(e) => handleInputChange(row.id, 'amount', e.target.value)}
                    className="form-control"
                  >
                    {Array.from({length: 10}, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <span className="amount-text">ב-</span>
                </div>
              </td>
              <td className="col-price">
                <div className="input-wrapper">
                  <input
                    type="number"
                    value={row.price}
                    onChange={(e) => handleInputChange(row.id, 'price', e.target.value)}
                    className="form-control"
                    min="0"
                  />
                  <span className="input-addon">₪</span>
                </div>
              </td>
              <td className="col-price-per-unit">
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={row.pricePerUnit || ''}
                    readOnly
                    className="form-control readonly"
                  />
                  <span className="input-addon">₪</span>
                </div>
              </td>
              <td className="col-action">
                <button 
                  className="remove-button"
                  onClick={() => removeRow(row.id)}
                  disabled={rows.length <= 2}
                  aria-label="הסר שורה"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Add Row Button */}
      <div className="add-row-container">
        <button className="add-button" onClick={addRow}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
          הוסף שורה
        </button>
      </div>
    </div>
  );
};

export default QuantityComparison;