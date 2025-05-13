// src/models/types.ts

export interface ProductRow {
    id: number;
    price: string;
    discount: string;
    finalPrice: string;
    isGroupStart?: boolean; // for quantity discount and free product discount
    amount?: string;        // for quantity comparison
    pricePerUnit?: string;  // for quantity comparison
    productSize?: string;   // for quantity comparison diff size
    productUnit?: string; // for quantity comparison diff size,  using string instead of enum for i18n
    standardizedPrice?: string;   // for quantity comparison diff size
  }
  
  export interface Totals {
    price: string;
    discount: string;
    finalPrice: string;
  }
  
// Enum values remain the same for backend logic, but will use translations for display
export enum DiscountType {
  FIXED_PERCENTAGE = "FIXED_PERCENTAGE",
  VARIABLE_PERCENTAGE = "VARIABLE_PERCENTAGE",
  PAYMENT_DISCOUNT = "PAYMENT_DISCOUNT",
  FREE_PRODUCT = "FREE_PRODUCT",
  QUANTITY_DISCOUNT = "QUANTITY_DISCOUNT",
  QUANTITY_COMPARISON = "QUANTITY_COMPARISON",
  TIP_CALCULATION = "TIP_CALCULATION"
}

// Map for backwards compatibility with existing code
export const DiscountTypeMapping = {
  "FIXED_PERCENTAGE": DiscountType.FIXED_PERCENTAGE,
  "VARIABLE_PERCENTAGE": DiscountType.VARIABLE_PERCENTAGE,
  "PAYMENT_DISCOUNT": DiscountType.PAYMENT_DISCOUNT,
  "FREE_PRODUCT": DiscountType.FREE_PRODUCT,
  "QUANTITY_DISCOUNT": DiscountType.QUANTITY_DISCOUNT,
  "QUANTITY_COMPARISON": DiscountType.QUANTITY_COMPARISON,
  "TIP_CALCULATION": DiscountType.TIP_CALCULATION
};

// Units for product comparison
export const ProductUnits = ['gram', 'kg', 'ml', 'liter'];