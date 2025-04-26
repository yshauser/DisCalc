// src/models/types.ts

export interface ProductRow {
    id: number;
    price: string;
    discount: string;
    finalPrice: string;
    isGroupStart?: boolean; // for quantity discount and free product discount
    amount?: string;        // for quantity comparison
    pricePerUnit?: string;  // for quantity comparison
  }
  
  export interface Totals {
    price: string;
    discount: string;
    finalPrice: string;
  }
  
  export enum DiscountType {
    FIXED_PERCENTAGE = "אחוזים קבועים",
    VARIABLE_PERCENTAGE = "אחוזים משתנים",
    PAYMENT_DISCOUNT = "הנחה על סכום",
    FREE_PRODUCT = "מוצר מתנה",
    QUANTITY_DISCOUNT = "הנחת כמות",
    QUANTITY_COMPARISON = "השוואת כמויות",
    TIP_CALCULATION = "חישוב טיפ"
  }