
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

export interface CardsResponse {
  cards: Record<string, string>;
}
