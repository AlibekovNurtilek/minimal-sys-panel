
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
