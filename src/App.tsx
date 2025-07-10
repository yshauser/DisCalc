// src/App.tsx

import React, { useState, useEffect } from 'react';
import './App.css';
import Header, {CurrencyContext, CurrencyType} from './components/Header';
import DiscountTypeSelector from './components/DiscountTypeSelector';
import ProductTable from './components/ProductTable';
import { ProductRow, Totals, DiscountType, ProductUnits } from './models/types';
import { useTranslation } from 'react-i18next';

// Import discount type components
import FixedPercentageDiscount from './discountTypes/FixedPercentageDiscount';
import VariablePercentageDiscount from './discountTypes/VariablePercentageDiscount';
import ReducedPaymentDiscount from './discountTypes/ReducedPaymentDiscount';
import FreeProductDiscount from './discountTypes/FreeProductDiscount';
import QuantityDiscount from './discountTypes/QuantityDiscount';
import QuantityComparison from './discountTypes/QuantityComarison';
import TipCalculator from './components/TipCalculator';
import DifferentSizesComparison from './discountTypes/DifferentSizesComparison';

import './i18n/i18n';

const App: React.FC = () => {
  // console.log ('in app');
  const {t, i18n} = useTranslation();
  const [currency, setCurrency] = useState<CurrencyType>('ILS');

  // State for rows and totals
  const [rows, setRows] = useState<ProductRow[]>([
    { id: 1, price: '', discount: '', finalPrice: '' }
  ]);
  
  const [totals, setTotals] = useState<Totals>({
    price: '0',
    discount: '0',
    finalPrice: '0'
  });
  
  // State for discount type
  const [discountType, setDiscountType] = useState<DiscountType>(DiscountType.FIXED_PERCENTAGE);
  const [fixedDiscount, setFixedDiscount] = useState<string>('');
    const [fixedMode,setFixedMode] = useState<'discount' | 'percentage'>('discount');
  // For Free product discount
    const [buyAmount, setBuyAmount] = useState<string>('2');
    const [getAmount, setGetAmount] = useState<string>('1');
  // For variable percentage discount
    const [variableMode, setVariableMode] = useState<'free' | 'tiered'>('tiered');
    const [tierDiscounts, setTierDiscounts] = useState<string[]>(['']);
  // For Reduced Payment discount
    const [buyPrice, setBuyPrice] = useState<string>('');
    const [payPrice, setPayPrice] = useState<string>('');
  // For Quantity discount
    const [priceForSingle, setPriceForSingle] = useState<string>('');
    const [priceForMultiple, setPriceForMultiple] = useState<string>('');
    const [quantityInGroup, setQuantityInGroup] = useState<string>('2');
  //  For Quantity comparison
    const [comparisonMode, setComparisonMode] = useState<'identical' | 'different'>('identical');

  // Default unit localization
  const getDefaultUnit = () => {
    return t('units.gram');
  };

  const handleDiscountTypeChange = (type: DiscountType) => {
    setDiscountType(type);
    console.log ('handle discount type change', {type})
    if (type === DiscountType.QUANTITY_COMPARISON) {
      console.log ('QC ', {comparisonMode})
      setRows([
        { 
          id: 1, 
          price: '', 
          amount: '1', 
          pricePerUnit: '', 
          discount: '', 
          finalPrice: '',
          productSize: '100',
          productUnit: getDefaultUnit(),
          standardizedPrice: ''
        },
        { 
          id: 2, 
          price: '', 
          amount: '1', 
          pricePerUnit: '', 
          discount: '', 
          finalPrice: '',
          productSize: '100',
          productUnit: getDefaultUnit(),
          standardizedPrice: ''
        }
      ]);
      setComparisonMode(comparisonMode);
    } else {
    // Reset rows' discount values when changing discount type
    setRows(prevRows => 
      prevRows.map(row => {
        return { ...row, discount: '', finalPrice: '' };
      })
    );
    }
    
    // Reset totals when changing discount type
    setTotals({
      price: '0',
      discount: '0',
      finalPrice: '0'
    });
  };

  const handleFixedDiscountChange = (value: string) => {
    setFixedDiscount(value);
  };

  const handleBuyAmountChange = (value: string) => {
    setBuyAmount(value);
  };

  const handleGetAmountChange = (value: string) => {
    setGetAmount(value);
  };

  const handleBuyPriceChange = (value: string) => {
    setBuyPrice(value);
  };

  const handlePayPriceChange = (value: string) => {
    setPayPrice(value);
  };

  const handlePriceForSingleChange = (value: string) => {
    setPriceForSingle(value);
  };
  
  const handlePriceForMultipleChange = (value: string) => {
    setPriceForMultiple(value);
  };
  
  const handleQuantityInGroupChange = (value: string) => {
    setQuantityInGroup(value);
  };

  // Handle refresh/reset button click
  const handleRefresh = () => {
    // Reset rows to initial state (single empty row)
    setRows([{ id: 1, price: '', discount: '', finalPrice: '', isGroupStart: false}]);
    // Reset totals
    setTotals({
      price: '0',
      discount: '0',
      finalPrice: '0'
    });
    
    // Reset fixed discount if applicable
    if (discountType === DiscountType.FIXED_PERCENTAGE) {
      setFixedDiscount('');
    } else if (discountType === DiscountType.VARIABLE_PERCENTAGE) {
      // setVariableMode('free');
      setTierDiscounts(['']);
    } else if (discountType === DiscountType.FREE_PRODUCT) {
      setBuyAmount('2');
      setGetAmount('1');
    } else if (discountType === DiscountType.PAYMENT_DISCOUNT) {
      setBuyPrice('');
      setPayPrice('');
    } else if (discountType === DiscountType.QUANTITY_DISCOUNT) {
      setPriceForSingle('');
      setPriceForMultiple('');
      setQuantityInGroup('2');
    } else if (discountType === DiscountType.QUANTITY_COMPARISON) {
      setRows([{ id: 1, price: '', discount: '', finalPrice: '', 
        amount: '1', pricePerUnit:'', productSize: '100', productUnit: getDefaultUnit(), standardizedPrice: ''
      },
      { id: 2, price: '', discount: '', finalPrice: '', 
        amount: '1', pricePerUnit:'', productSize: '100', productUnit: getDefaultUnit(), standardizedPrice: ''
      }
    ]);
    }
  };

    // Update units when language changes
    useEffect(() => {
      if (discountType === DiscountType.QUANTITY_COMPARISON) {
        setRows(prevRows => 
          prevRows.map(row => {
            // Translate the unit if it exists
            const unitKey = Object.entries(ProductUnits).find(([_, value]) => 
              row.productUnit === t(`units.${value}`, { lng: i18n.language === 'HE' ? 'EN' : 'HE' })
            )?.[0];
            
            return { 
              ...row, 
              productUnit: unitKey ? t(`units.${ProductUnits[parseInt(unitKey)]}`) : getDefaultUnit()
            };
          })
        );
      }
    }, [i18n.language]);

    return (
    <div className="app">
      <CurrencyContext.Provider value={{ currency, setCurrency }}>
      <Header />
      
      <main className="main">
        <div className="calculator-container">
            <DiscountTypeSelector
              selectedType={discountType}
              fixedDiscount={fixedDiscount}
              fixedMode={fixedMode}
              onFixedModeChange={setFixedMode}
              onTypeChange={handleDiscountTypeChange}
              onFixedDiscountChange={handleFixedDiscountChange}

              buyAmount={buyAmount}
              getAmount={getAmount}
              onBuyAmountChange={handleBuyAmountChange}
              onGetAmountChange={handleGetAmountChange}

              buyPrice={buyPrice}
              payPrice={payPrice}
              onBuyPriceChange={handleBuyPriceChange}
              onPayPriceChange={handlePayPriceChange}

              priceForSingle={priceForSingle}
              priceForMultiple={priceForMultiple}
              quantityInGroup={quantityInGroup}
              onPriceForSingleChange={handlePriceForSingleChange}
              onPriceForMultipleChange={handlePriceForMultipleChange}
              onQuantityInGroupChange={handleQuantityInGroupChange}

              variableMode={variableMode}
              tierDiscounts={tierDiscounts}
              onVariableModeChange={setVariableMode}
              onTierDiscountsChange={setTierDiscounts}

              comparisonMode={comparisonMode}
              onComparisonModeChange={setComparisonMode}

              onRefresh={handleRefresh}
            />

          {/* Render the appropriate discount component based on selected type */}
          {discountType === DiscountType.FIXED_PERCENTAGE && (
            <FixedPercentageDiscount 
              rows={rows}
              fixedDiscount={fixedDiscount}
              fixedMode={fixedMode}
              setRows={setRows}
              setTotals={setTotals}
            />
          )}
          
          {discountType === DiscountType.VARIABLE_PERCENTAGE && (
            <VariablePercentageDiscount 
              rows={rows}
              setRows={setRows}
              setTotals={setTotals}
              variableMode={variableMode}
              tierDiscounts={tierDiscounts}
            />
          )}

          {discountType === DiscountType.PAYMENT_DISCOUNT && (
            <ReducedPaymentDiscount 
              rows={rows}
              buyPrice={buyPrice}
              payPrice={payPrice}
              setRows={setRows}
              setTotals={setTotals}
            />
          )}

          {discountType === DiscountType.FREE_PRODUCT && (
            <FreeProductDiscount 
              rows={rows}
              buyAmount={buyAmount}
              getAmount={getAmount}
              setRows={setRows}
              setTotals={setTotals}
            />
          )}

          {discountType === DiscountType.QUANTITY_DISCOUNT && (
            <QuantityDiscount
              rows={rows}
              priceForSingle={priceForSingle}
              priceForMultiple={priceForMultiple}
              quantityInGroup={quantityInGroup}
              setRows={setRows}
              setTotals={setTotals}
            />
          )}
          
          {discountType === DiscountType.QUANTITY_COMPARISON && (
            <QuantityComparison
              rows={rows}
              setRows={setRows}
              comparisonMode={comparisonMode}
            />
          )}

          {/* Show either ProductTable or TipCalculator based on discount type or nothing for comparison mode*/}
          {discountType !== DiscountType.TIP_CALCULATION && 
              (discountType !== DiscountType.QUANTITY_COMPARISON)? (
              <ProductTable 
                rows={rows}
                totals={totals}
                discountType={discountType}
                mode={fixedMode}
                priceForSingle={priceForSingle}
                setRows={setRows}
              />
            ) : discountType === DiscountType.TIP_CALCULATION ? (
              <TipCalculator 
                setTotals={setTotals}
              />
              
            ) : discountType === DiscountType.QUANTITY_COMPARISON && comparisonMode === 'different' && (
              <DifferentSizesComparison 
                rows={rows}
                setRows={setRows}
              />
            )}
        </div>
      </main>
      </CurrencyContext.Provider>
    </div>
  );
};

export default App;