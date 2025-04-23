// src/components/ProductTable.tsx

import React from 'react';
import { ProductRow, Totals, DiscountType } from '../models/types';
import { calculateFinalPrice } from '../utils/calculations';
import TipCalculator from './TipCalculator';
import './Table.css';

interface ProductTableProps {
  rows: ProductRow[];
  totals: Totals;
  discountType: DiscountType;
  setRows: React.Dispatch<React.SetStateAction<ProductRow[]>>;
  setTotals?: React.Dispatch<React.SetStateAction<Totals>>;
}

const ProductTable: React.FC<ProductTableProps> = ({
  rows,
  totals,
  discountType,
  setRows,
  setTotals
}) => {
  // If TIP_CALCULATION is selected, render the TipCalculator component
  if (discountType === DiscountType.TIP_CALCULATION && setTotals) {
    return <TipCalculator setTotals={setTotals} />;
  }

  // Handle price or discount change
  const handleInputChange = (id: number, field: 'price' | 'discount', value: string) => {
    setRows(prevRows => {
      return prevRows.map(row => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: value };
          
          // Only calculate final price for variable discount type or when changing price
          if (discountType !== DiscountType.FIXED_PERCENTAGE || field === 'price') {
            if (updatedRow.price && updatedRow.discount) {
              updatedRow.finalPrice = calculateFinalPrice(updatedRow.price, updatedRow.discount);
            }
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
    const newRow = { id: newId, price: '', discount: '', finalPrice: '' };
    
    // If using fixed percentage, apply it to the new row
    if (discountType === DiscountType.FIXED_PERCENTAGE && rows.length > 0 && rows[0].discount) {
      newRow.discount = rows[0].discount;
    }
    
    setRows([...rows, newRow]);
  };

  // Remove a row
  const removeRow = (id: number) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== id));
    }
  };

  // Determine if discount input should be disabled (for fixed percentage mode)
  const isDiscountDisabled = discountType === DiscountType.FIXED_PERCENTAGE || discountType === DiscountType.FREE_PRODUCT;

  return (
  <div className="calculator-table">
    <table className="product-table">
      <thead>
      <tr>
        <th className="col-price">מחיר</th>
        <th className="col-discount">הנחה</th>
        <th className="col-final">מחיר אחרי הנחה</th>
        <th className="col-action"></th>
      </tr>
      </thead>
      <tbody>
      {rows.map((row, index) => (
        <tr key={row.id}
        className={` ${discountType == DiscountType.FREE_PRODUCT && row.isGroupStart && index !== 0 ? 'border-t' : ''}`}
        >
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
          <td className="col-discount">
            <div className="input-wrapper">
              <input
                type="number"
                value={row.discount}
                onChange={(e) => handleInputChange(row.id, 'discount', e.target.value)}
                className="form-control"
                min="0"
                max="100"
                disabled={isDiscountDisabled}
              />
              <span className="input-addon">%</span>
            </div>
          </td>
          <td className="col-final">
            <div className="input-wrapper">
              <input
                type="text"
                value={row.finalPrice}
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
              disabled={rows.length === 1}
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

      {/* Totals Row */}
      {rows.length > 1 && (
        <tfoot>
          <td className="totals-header">סיכום</td>
          <tr className="totals-row">
            <td>
              {/* <div className="totals-label">מחיר מקורי</div> */}
              <div className="input-wrapper">
                <input
                  type="text"
                  value={totals.price}
                  readOnly
                  className="form-control readonly bold"
                />
                <span className="input-addon">₪</span>
              </div>
            </td>
            <td>
              {/* <div className="totals-label">הנחה</div> */}
              <div className="input-wrapper">
                <input
                  type="text"
                  value={totals.discount}
                  readOnly
                  className="form-control readonly bold"
                />
                <span className="input-addon">%</span>
              </div>
            </td>
            <td>
              {/* <div className="totals-label">לתשלום</div> */}
              <div className="input-wrapper">
                <input
                  type="text"
                  value={totals.finalPrice}
                  readOnly
                  className="form-control readonly bold"
                />
                <span className="input-addon">₪</span>
              </div>
            </td>
            <td className="action-cell"></td>
          </tr>
        </tfoot>
      )}
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

export default ProductTable;