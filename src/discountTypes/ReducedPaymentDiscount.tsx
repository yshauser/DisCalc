//src/discountTypes/ReducedPaymentDiscount.tsx
import React, { useEffect , useRef} from 'react';
import { ProductRow, Totals } from '../models/types';
import { calculateTotalsForPaymentDiscount } from '../utils/calculations';

interface ReducedPaymentDiscount {
  rows: ProductRow[];
  buyPrice: string;
  payPrice: string;
  setRows: React.Dispatch<React.SetStateAction<ProductRow[]>>;
  setTotals: React.Dispatch<React.SetStateAction<Totals>>;
}

const ReducedPaymentDiscount: React.FC<ReducedPaymentDiscount> = ({
  rows,
  buyPrice,
  payPrice,
  setRows,
  setTotals
}) => {
  // Apply the "Buy X Pay Y" discount logic
  // Use ref to track previous values to avoid unnecessary updates
  const prevValuesRef = useRef({
    rowsLength: 0,
    rowPrice: '',
    buyPrice: '',
    payPrice: '',
    discount: '',
    finalPrice: ''
  });

     // Separate effect to handle price changes in rows
    useEffect(() => {
        if (rows.length === 1){
            const rowPrice = rows[0].price === '' ? '0' : rows[0].price;
            const buyPriceValue = buyPrice === '' ? '0' : buyPrice;
            const payPriceValue = payPrice === '' ? '0' : payPrice;

            // Check if any relevant values have changed
            const valuesChanged = 
                prevValuesRef.current.rowsLength !== rows.length ||
                prevValuesRef.current.rowPrice !== rowPrice ||
                prevValuesRef.current.buyPrice !== buyPriceValue ||
                prevValuesRef.current.payPrice !== payPriceValue ||
                prevValuesRef.current.discount !== rows[0].discount ||
                prevValuesRef.current.finalPrice !== rows[0].finalPrice;
         
            if (valuesChanged && parseFloat(buyPriceValue) > 0 && parseFloat(rowPrice) > 0) {
                const paymentDiscountTimes = Math.floor(parseFloat(rows[0].price)/ parseFloat(buyPrice));
                const finalPrice = parseFloat(rows[0].price) - (paymentDiscountTimes * (parseFloat(buyPrice)-parseFloat(payPrice)));
                const finalDiscount = 100 - ((finalPrice * 100) / parseFloat(rows[0].price));
                const processedRows = rows.map(row => {
                return {
                    ...row,
                    discount: finalDiscount.toFixed(2),
                    finalPrice: finalPrice.toFixed(2)
                };
                });
              // Store current values for future comparison
                prevValuesRef.current = {
                    rowsLength: rows.length,
                    rowPrice,
                    buyPrice: buyPriceValue,
                    payPrice: payPriceValue,
                    discount: finalDiscount.toFixed(2),
                    finalPrice: finalPrice.toFixed(2)
                };
                setRows(processedRows);
            }
        } else {
            // Default behavior for multiple rows - reset discounts if needed
            const needsReset = rows.some(row => 
                row.discount !== '' || 
                row.finalPrice !== ''
            );
            
            if (needsReset) {
                const processedRows = rows.map(row => {
                const priceValue = row.price === '' ? '0' : row.price;
                return {
                    ...row,
                    discount: '',
                    finalPrice: ''
                };
                });  
                setRows(processedRows);
            }

            // Update ref for multiple rows case
            if (rows.length > 0) {
                prevValuesRef.current = {
                rowsLength: rows.length,
                rowPrice: rows[0].price || '',
                buyPrice,
                payPrice,
                discount:  '',
                finalPrice:  ''
                };
            }
        }
}, [rows, buyPrice, payPrice, setRows]);

    // Calculate totals whenever relevant values change
    useEffect(() => {
        setTotals(calculateTotalsForPaymentDiscount(buyPrice, payPrice, rows));
    }, [rows, buyPrice, payPrice, setTotals]);
  
  return null; // This component doesn't render anything, it just handles logic
};

export default ReducedPaymentDiscount;