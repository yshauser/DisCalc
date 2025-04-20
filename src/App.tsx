import React, { useState, useEffect } from 'react';
import { CalculatorIcon, MenuIcon } from 'lucide-react';

const App = () => {
  const [price, setPrice] = useState<string>('');
  const [discount, setDiscount] = useState<string>('');
  const [finalPrice, setFinalPrice] = useState<string>('');

  // Calculate final price whenever price or discount changes
  useEffect(() => {
    if (price && discount) {
      const priceNum = parseFloat(price);
      const discountNum = parseFloat(discount);
      
      if (!isNaN(priceNum) && !isNaN(discountNum)) {
        const calculatedPrice = priceNum * ((100 - discountNum) / 100);
        setFinalPrice(calculatedPrice.toFixed(2));
      } else {
        setFinalPrice('');
      }
    } else {
      setFinalPrice('');
    }
  }, [price, discount]);

  return (
    <div className="flex flex-col h-screen font-sans bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex items-center shadow-md">
        <button className="p-2 rounded-full hover:bg-blue-700 transition-colors">
          <MenuIcon size={24} />
        </button>
        <div className="flex items-center mx-auto">
          <CalculatorIcon className="mr-2" size={24} />
          <h1 className="text-xl font-bold">כמה זה יוצא לי - מחשבון הנחות</h1>
        </div>
        <div className="w-8"></div> {/* For balance */}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
          <div className="space-y-6">
            {/* Price Input */}
            <div className="space-y-2">
              <label htmlFor="price" className="block text-lg font-medium text-gray-700">
                מחיר
              </label>
              <div className="relative">
                <input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                  placeholder="הזן מחיר"
                />
                <span className="absolute left-3 top-3 text-gray-500">₪</span>
              </div>
            </div>

            {/* Discount Input */}
            <div className="space-y-2">
              <label htmlFor="discount" className="block text-lg font-medium text-gray-700">
                הנחה
              </label>
              <div className="relative">
                <input
                  id="discount"
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                  placeholder="הזן אחוז הנחה"
                  min="0"
                  max="100"
                />
                <span className="absolute left-3 top-3 text-gray-500">%</span>
              </div>
            </div>

            {/* Final Price Output */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <label htmlFor="finalPrice" className="block text-lg font-medium text-gray-700">
                מחיר אחרי הנחה
              </label>
              <div className="relative">
                <input
                  id="finalPrice"
                  type="text"
                  value={finalPrice}
                  readOnly
                  className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg text-right font-bold text-blue-600"
                />
                <span className="absolute left-3 top-3 text-gray-500">₪</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;