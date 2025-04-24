// src/models/types.ts

export interface ProductRow {
    id: number;
    price: string;
    discount: string;
    finalPrice: string;
    isGroupStart?: boolean;
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
    TIP_CALCULATION = "חישוב טיפ"
  }