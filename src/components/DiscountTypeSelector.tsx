import React from 'react';
import { DiscountType } from '../models/types';
import { RotateCw } from 'lucide-react';

interface DiscountTypeSelectorProps {
  selectedType: DiscountType;
  fixedDiscount: string;
  buyAmount: string;
  getAmount: string;
  onTypeChange: (type: DiscountType) => void;
  onFixedDiscountChange: (value: string) => void;
  onBuyAmountChange: (value: string) => void;
  onGetAmountChange: (value: string) => void;
  onRefresh: () => void;
}

const DiscountTypeSelector: React.FC<DiscountTypeSelectorProps> = ({
  selectedType,
  fixedDiscount,
  buyAmount,
  getAmount,
  onTypeChange,
  onFixedDiscountChange,
  onBuyAmountChange,
  onGetAmountChange,
  onRefresh
}) => {
  return (
    <div className="discount-type-section">
      <div className="discount-type-container">
        <div className="discount-header">
          <label htmlFor="discountType" className="discount-type-label">
            סוג הנחה:
          </label>
          <button 
            onClick={onRefresh}
            className="refresh-button"
            title="נקה נתונים"
            aria-label="נקה נתונים"
          >
            <RotateCw size={16} />
          </button>
        </div>
        <select
          id="discountType"
          className="discount-type-select"
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value as DiscountType)}
        >
          {Object.values(DiscountType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {selectedType === DiscountType.FIXED_PERCENTAGE && (
        <div className="fixed-discount-container">
          <label htmlFor="fixedDiscount" className="fixed-discount-label">
            אחוז הנחה קבוע:
          </label>
          <div className="input-wrapper fixed-discount-input">
            <input
              id="fixedDiscount"
              type="number"
              value={fixedDiscount}
              onChange={(e) => onFixedDiscountChange(e.target.value)}
              className="form-control"
              placeholder="הזן אחוז הנחה"
              min="0"
              max="100"
            />
            <span className="input-addon">%</span>
          </div>
        </div>
      )}

      {selectedType === DiscountType.FREE_PRODUCT && (
        <div className="buy-get-container">
          <div className="buy-get-row">
            <span className="buy-get-text">קנו</span>
            <div className="buy-amount-input">
              <input
                type="number"
                value={buyAmount}
                onChange={(e) => onBuyAmountChange(e.target.value)}
                className="form-control"
                min="1"
                max="100"
              />
            </div>
          </div>
          <div className="buy-get-row">
            <span className="buy-get-text">קבלו</span>
            <div className="get-amount-input">
              <input
                type="number"
                value={getAmount}
                onChange={(e) => onGetAmountChange(e.target.value)}
                className="form-control"
                min="1"
                max="100"
              />
            </div>
            <span className="buy-get-text">במתנה</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountTypeSelector;