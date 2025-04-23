//src/components/DiscountTypeSelector.tsx
import React, {useState} from 'react';
import { DiscountType } from '../models/types';
import { RotateCw, Plus, Minus } from 'lucide-react';
import './Selector.css';

interface DiscountTypeSelectorProps {
  selectedType: DiscountType;
  fixedDiscount: string;
  buyAmount: string;
  getAmount: string;
  variableMode: 'free' | 'tiered';
  tierDiscounts: string[];
  onTypeChange: (type: DiscountType) => void;
  onFixedDiscountChange: (value: string) => void;
  onBuyAmountChange: (value: string) => void;
  onGetAmountChange: (value: string) => void;
  onVariableModeChange: (mode: 'free' | 'tiered') => void;
  onTierDiscountsChange: (discounts: string[]) => void;
  onRefresh: () => void;
}

type VariableDiscountMode = 'free' | 'tiered';

const DiscountTypeSelector: React.FC<DiscountTypeSelectorProps> = ({
  selectedType,
  fixedDiscount,
  buyAmount,
  getAmount,
  variableMode,
  tierDiscounts,
  onTypeChange,
  onFixedDiscountChange,
  onBuyAmountChange,
  onGetAmountChange,
  onVariableModeChange,
  onTierDiscountsChange,
  onRefresh
}) => {


  const handleTierDiscountChange = (index: number, value: string) => {
    const newTierDiscounts = [...tierDiscounts];
    newTierDiscounts[index] = value;
    onTierDiscountsChange(newTierDiscounts);
  };

  const addTierDiscount = () => {
    if (tierDiscounts.length < 5) {
      onTierDiscountsChange([...tierDiscounts, '']);
    }
  };

  const removeTierDiscount = (index: number) => {
    const newTierDiscounts = [...tierDiscounts];
    newTierDiscounts.splice(index, 1);
    onTierDiscountsChange(newTierDiscounts);
  };

  const getTierLabel = (index: number) => {
    const labels = ["הראשון ב-", "השני ב-", "השלישי ב-", "הרביעי ב-", "החמישי ב-"];
    return labels[index];
  };


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

       {selectedType === DiscountType.VARIABLE_PERCENTAGE && (
        <div className="variable-discount-container">
           <div className="variable-mode-buttons">
            <button
              type="button"
              className={`mode-button ${variableMode === 'free' ? 'mode-button-active' : ''}`}
              onClick={() => onVariableModeChange('free')}
            >
              חופשי
            </button>
            <button
              type="button"
              className={`mode-button ${variableMode === 'tiered' ? 'mode-button-active' : ''}`}
              onClick={() => onVariableModeChange('tiered')}
            >
              מדורג
            </button>
          </div>

          {variableMode === 'tiered' && (
            <div className="tiered-discounts-container">
              {tierDiscounts.map((discount, index) => (
                <div key={index} className="tiered-discount-row">
                  <span className="tier-label">{getTierLabel(index)}</span>
                  <div className="input-wrapper tier-discount-input">
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => handleTierDiscountChange(index, e.target.value)}
                      className="form-control"
                      placeholder="אחוז הנחה"
                      min="0"
                      max="100"
                    />
                    <span className="input-addon">%</span>
                  </div>
                  
                  <div className="tier-actions">
                    {tierDiscounts.length < 5 && index === tierDiscounts.length - 1 && (
                      <button
                        type="button"
                        onClick={addTierDiscount}
                        className="tier-button add-button-small"
                        aria-label="הוסף שורה"
                        title="הוסף שורה"
                      >
                        <Plus size={16} />
                      </button>
                    )}
                    
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeTierDiscount(index)}
                        className="tier-button remove-button"
                        aria-label="הסר שורה"
                        title="הסר שורה"
                      >
                        <Minus size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedType === DiscountType.FREE_PRODUCT && (
        <div className="buy-get-container">
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
      )}
    </div>
  );
};

export default DiscountTypeSelector;