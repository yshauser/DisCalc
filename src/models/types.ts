// src/models/types.ts

export interface ProductRow {
    id: number;
    price: string;
    discount: string;
    finalPrice: string;
  }
  
  export interface Totals {
    price: string;
    discount: string;
    finalPrice: string;
  }
  
  export enum DiscountType {
    FIXED_PERCENTAGE = "אחוזים קבועים",
    VARIABLE_PERCENTAGE = "אחוזים משתנים",
    FREE_PRODUCT = "מוצר מתנה",
    TIP_CALCULATION = "חישוב טיפ"
  }