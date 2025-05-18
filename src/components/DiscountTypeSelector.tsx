//src/components/DiscountTypeSelector.tsx
import React, {useContext} from 'react';
import { DiscountType } from '../models/types';
import { RotateCw, Plus, Minus } from 'lucide-react';
import './Selector.css';
import { useTranslation } from 'react-i18next';
import { CurrencyContext, currencySymbols } from './Header';

interface DiscountTypeSelectorProps {
  selectedType: DiscountType;
  fixedDiscount: string;
  buyAmount: string;
  getAmount: string;
  buyPrice: string;
  payPrice: string;
  priceForSingle: string;
  priceForMultiple: string;
  quantityInGroup: string;
  variableMode: 'free' | 'tiered';
  tierDiscounts: string[];
  comparisonMode: 'identical' | 'different';
  onTypeChange: (type: DiscountType) => void;
  onFixedDiscountChange: (value: string) => void;
  onBuyAmountChange: (value: string) => void;
  onGetAmountChange: (value: string) => void;
  onBuyPriceChange: (value: string) => void;
  onPayPriceChange: (value: string) => void;
  onPriceForSingleChange: (value: string) => void;
  onPriceForMultipleChange: (value: string) => void;
  onQuantityInGroupChange: (value: string) => void;
  onVariableModeChange: (mode: 'free' | 'tiered') => void;
  onTierDiscountsChange: (discounts: string[]) => void;
  onComparisonModeChange: (mode: 'identical' | 'different') => void;
  onRefresh: () => void;
}

const DiscountTypeSelector: React.FC<DiscountTypeSelectorProps> = ({
  selectedType,
  fixedDiscount,
  buyAmount, //
  getAmount,
  buyPrice,
  payPrice,
  variableMode,
  tierDiscounts,
  priceForSingle,
  priceForMultiple,
  quantityInGroup,
  comparisonMode,
  onTypeChange,
  onFixedDiscountChange,
  onBuyAmountChange,
  onGetAmountChange,
  onBuyPriceChange,
  onPayPriceChange,
  onPriceForSingleChange,
  onPriceForMultipleChange,
  onQuantityInGroupChange,
  onVariableModeChange,
  onTierDiscountsChange,
  onComparisonModeChange,
  onRefresh
}) => {

  const { t } = useTranslation();
  const { currency } = useContext(CurrencyContext);

  // Ensure we have at least two tier discounts when in tiered mode
  React.useEffect(() => {
    if (variableMode === 'tiered' && tierDiscounts.length < 2) {
      // Initialize with two empty tier discounts if we have less than two
      onTierDiscountsChange(tierDiscounts.length === 0 ? ['', ''] : [...tierDiscounts, '']);
    }
  }, [variableMode, tierDiscounts, onTierDiscountsChange]);

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
    if (tierDiscounts.length<=2){
      return;
    }
    const newTierDiscounts = [...tierDiscounts];
    newTierDiscounts.splice(index, 1);
    onTierDiscountsChange(newTierDiscounts);
  };

  const getTierLabel = (index: number) => {
    const labels = [t(`variablePercentage.first`),t(`variablePercentage.second`),t(`variablePercentage.third`),t(`variablePercentage.fourth`),t(`variablePercentage.fifth`)];
    return labels[index];
  };


  return (
    <div className="discount-type-section">
      <div className="discount-type-container">
        <div className="discount-header">
          <label htmlFor="discountType" className="discount-type-label">
          {t(`labels.discountType`)}:
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
              {t(`discountTypes.${type}`)}
            </option>
          ))}
        </select>
      </div>

      {selectedType === DiscountType.FIXED_PERCENTAGE && (
        <div className="fixed-discount-container">
          <label htmlFor="fixedDiscount" className="fixed-discount-label">
          {t('discountTypes.FIXED_PERCENTAGE')} %:
          </label>
          <div className="input-wrapper fixed-discount-input">
            <input
              id="fixedDiscount"
              type="number"
              value={fixedDiscount}
              onChange={(e) => onFixedDiscountChange(e.target.value)}
              className="form-control"
              placeholder={t(`labels.discount_percentage`)}
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
              className={`mode-button ${variableMode === 'tiered' ? 'mode-button-active' : ''}`}
              onClick={() => onVariableModeChange('tiered')}
            >
              {t(`labels.tiered`)}
            </button>
            <button
              type="button"
              className={`mode-button ${variableMode === 'free' ? 'mode-button-active' : ''}`}
              onClick={() => onVariableModeChange('free')}
            >
              {t(`labels.free`)}
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
                      placeholder={t(`labels.discount_percentage`)}
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
                        aria-label={t(`productTable.add`)}
                        title={t(`productTable.add`)}
                      >
                        <Plus size={16} />
                      </button>
                    )}
                    
                    {index > 0 && tierDiscounts.length >2 && (
                      <button
                        type="button"
                        onClick={() => removeTierDiscount(index)}
                        className="tier-button remove-button"
                        aria-label={t(`productTable.remove`)}
                        title={t(`productTable.remove`)}
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

      {selectedType === DiscountType.PAYMENT_DISCOUNT && (
        <div className="buy-get-container">
          <span className="buy-get-text">{t(`paymentDiscount.buy`)}</span>
          <div className="input-wrapper buy-amount-input">
            <input
              type="number"
              value={buyPrice}
              onChange={(e) => onBuyPriceChange(e.target.value)}
              className="form-control"
              min="1"
              max="100"
            />
            <span className="input-addon">{currencySymbols[currency]}</span>
          </div>
          <span className="buy-get-text">{t(`paymentDiscount.pay`)}</span>
          <div className="input-wrapper get-amount-input">
            <input
              type="number"
              value={payPrice}
              onChange={(e) => onPayPriceChange(e.target.value)}
              className="form-control"
              min="1"
              max="100"
            />
            <span className="input-addon">{currencySymbols[currency]}</span>
          </div>
        </div>
      )}

      {selectedType === DiscountType.FREE_PRODUCT && (
        <div className="buy-get-container">
          <span className="buy-get-text">{t('freeProduct.buy')}:</span>
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
          <span className="buy-get-text">{t('freeProduct.get')}:</span>
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
          <span className="buy-get-text">{t('freeProduct.forFree')}</span>
        </div>
      )}

      {selectedType === DiscountType.QUANTITY_DISCOUNT && (
        <div className="quantity-discount-container">
          <div className="quantity-discount-row">
            <span className="quantity-label">{t(`quantityDiscount.single`)}</span>
            <div className="input-wrapper">
              <input
                type="number"
                value={priceForSingle}
                onChange={(e) => onPriceForSingleChange(e.target.value)}
                className="form-control"
                min="0"
              />
              <span className="input-addon">{currencySymbols[currency]}</span>
            </div>
          </div>
          
          <div className="quantity-discount-row">
            <div className="quantity-group-input">
              <select
                value={quantityInGroup}
                onChange={(e) => onQuantityInGroupChange(e.target.value)}
                className="form-control"
              >
                {Array.from({length: 9}, (_, i) => i + 2).map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <span className="quantity-label">{t(`quantityDiscount.multi`)}</span>
            <div className="input-wrapper">
              <input
                type="number"
                value={priceForMultiple}
                onChange={(e) => onPriceForMultipleChange(e.target.value)}
                className="form-control"
                min="0"
              />
              <span className="input-addon">{currencySymbols[currency]}</span>
            </div>
          </div>
        </div>
      )}

      {selectedType === DiscountType.QUANTITY_COMPARISON && (
        <div className="comparison-mode-container">
          <div className="comparison-mode-buttons">
            <button
              type="button"
              className={`mode-button ${comparisonMode === 'identical' ? 'mode-button-active' : ''}`}
              onClick={() => onComparisonModeChange('identical')}
            >
              {t(`quantityComparison.same`)}
            </button>
            <button
              type="button"
              className={`mode-button ${comparisonMode === 'different' ? 'mode-button-active' : ''}`}
              onClick={() => onComparisonModeChange('different')}
            >
              {t(`quantityComparison.diff`)}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default DiscountTypeSelector;