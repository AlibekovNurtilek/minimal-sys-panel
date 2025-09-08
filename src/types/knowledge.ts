
export interface AboutUs {
  bank_name: string;
  founded: string;
  license: string;
  mission: string;
  values: string[];
  ownership: {
    main_shareholder: string;
    country: string;
    ownership_percentage: string;
  };
  branches: {
    head_office: string;
    regions: string[];
  };
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  descr: string;
}



export interface ContactlessLimits {
  transactions_count?: string;
  transactions_amount?: string;
}

export interface ATMWithdrawLimits {
  kgs?: string;
  usd?: string;
}

export interface CardLimits {
  contactless?: ContactlessLimits;
  atm_withdraw?: ATMWithdrawLimits;
  internal_transfer_atm?: string;
  currency_exchange_atm?: string;
  pos_non_cash?: string;
  payroll_limit?: string;
}

// Типы для специальных карт
export interface CardConditions {
  general?: {
    issuance?: string;
    annual_fee?: string;
  };
  except?: {
    name?: string;
    issuance?: string;
    annual_fee?: string;
  };
}

// Универсальный интерфейс для всех карт
export interface CardDetail {
  // Обязательные поля (есть у всех карт)
  name: string;
  descr: string;
  
  // Основные поля карт (опциональные)
  currency?: string[];
  validity?: string;
  issuance?: string;
  annual_fee?: string;
  
  // Кредитные карты
  annual_fee_payroll_first_year?: string;
  annual_fee_payroll_next_years?: string;
  payroll_limit?: string;
  collateral?: string;
  interest_rate_atm_cash?: string;
  interest_rate_pos?: string;
  grace_period?: string;
  additional_card?: string;
  card_min_limit?: string;
  
  // Лимиты
  limits?: CardLimits;
  
  // Специальные поля для конкретных карт
  
  // Card Plus
  instructions?: Record<string, string>;
  rates?: Record<string, string>;
  benefits?: string[];
  
  // Виртуальная карта
  notes?: string[];
  
  // Элкарт
  conditions?: CardConditions;
  
  // Campus Card
  Services?: string[];
  
  // Для любых дополнительных полей, которые могут появиться в будущем
  [key: string]: any;
}


export interface CardsResponse {
  cards: Record<string, CardDetail>;
}

export interface CardsList {
  cards: Record<string, CardDetail>;
}



// Loans Info
export interface LoanApplicationProcess {
  steps: string[];
  review_time: string;
}

export interface RequiredDocuments {
  borrower_guarantor: string[];
  collateral: {
    movable_property: string[];
    real_estate: string[];
  };
  note: string;
}

export interface LoanProduct {
  type: string;
  name: string;
  description: string;
  advantages: string[];
  purposes:string[]
}


  export interface OwnFundsObject {
    new_car?: string;
    used_car?: { age: string; percent: string }[];
  }

export interface Subcategory {
  name: string;
  amount?: { KGS?: string; USD?: string } | string;
  term?: string;
  rate?: string;
  rates?: { KGS?: string; USD?: string };
  collateral?: string;
  grace_period?: string;
  advantages?: string[];
  repayment?: string[];
  commission?: string;
  processing?: string;
  disbursement?: string;
  own_funds?: string | OwnFundsObject; 
  purpose?: string;
  effective_rate?: string;
  collateral_tiers?: any[];

}

export interface RateItem {
  amount: string;
  rate: string;
}

export type RateValue = string | RateItem[];

export interface Rates {
  [currency: string]: RateValue;
}

export interface CollateralTier {
  amount: string;
  payroll?: string;
  non_payroll?: string;
  requirement?: string;
}
export interface LoanSubcategory {
  name: string;
  purpose?: string;
  amount?: string | { KGS?: string; USD?: string };
  term?: string;
  rate?: string;
  rates?: string | Rates;
  collateral?: string | { [key: string]: string } | CollateralTier[]; // ✅ строка, объект или массив объектов
  collateral_tiers?: CollateralTier[]; // можешь оставить для совместимости
  commission?: string;
  processing?: string;
  disbursement?: string;
  repayment?: string[];
  own_funds?: string | OwnFundsObject; 
  effective_rate?: string;
  grace_period?: string;
  advantages?: string[];
}

// Специальные программы
export interface SpecialProgram {
  name: string;
  purpose: string;
  amount: string;
  term: string;
  rate?: string;
  rates?: {
    payroll?: { amount: string; rate: string }[];
    non_payroll?: { amount: string; rate: string }[];
  };
  collateral?: any; // можно уточнить, зависит от payroll/non_payroll
  conditions?: string;
  effective_rate?: string;
}

// Специальные предложения
export interface SpecialOffer {
  name: string;
  company: string;
  term: string;
  rate: string;
}




export interface LoanUpdatePayload {
  subcategories?: Subcategory[]; // обновленные подкатегории
  specialPrograms?: SpecialProgram[]; // обновленные специальные программы
  specialOffers?: Record<string, SpecialOffer[]>; // обновленные специальные предложения
}
