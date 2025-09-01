import {API_BASE_URL} from "@/config"
const BASE_URL = `${API_BASE_URL}/api/admin`;

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user_id: number;
}

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  birth_date: string;
  passport_number: string;
  phone_number: string;
  email: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface CustomersResponse {
  items: Customer[];
  page: number;
  page_size: number;
  total: number;
}

export interface Account {
  id: number;
  account_number: string;
  account_type: string;
  currency: string;
  balance: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AccountsResponse {
  items: Account[];
  page: number;
  page_size: number;
  total: number;
}

export interface Card {
  id: number;
  account_id: number;
  card_number: string;
  card_type: string;
  expiration_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CardsResponse {
  items: Card[];
  page: number;
  page_size: number;
  total: number;
}

export interface Transaction {
  id: number;
  from_account_id: number;
  to_account_id: number;
  transaction_type: string;
  amount: number;
  currency: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionsResponse {
  items: Transaction[];
  page: number;
  page_size: number;
  total: number;
}

export interface Loan {
  id: number;
  customer_id: number;
  loan_type: string;
  principal_amount: number;
  interest_rate: number;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface LoansResponse {
  items: Loan[];
  page: number;
  page_size: number;
  total: number;
}

export interface DepositsResponse {
  deposits: Record<string, string>;
}

export interface DepositResponse {
  [key: string]: any; // Flexible response to accept any JSON structure
}

export type FAQCategoriesResponse = string[];

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface FAQResponse {
  category: string;
  items: FAQItem[];
  page: number;
  page_size: number;
  total: number;
}

export interface UpdateFAQResponse {
  status: string;
  updated_item: FAQItem;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${this.baseUrl}/user`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to get user');
    }

    return response.json();
  }

  async logout(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/logout`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
      },
      credentials: 'include',
      body: '',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  }

  async getCustomers(page: number = 1, pageSize: number = 10): Promise<CustomersResponse> {
    const response = await fetch(`${this.baseUrl}/customers?page=${page}&page_size=${pageSize}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to get customers');
    }

    return response.json();
  }

  async getCustomer(customerId: number): Promise<Customer> {
    const response = await fetch(`${this.baseUrl}/customers/${customerId}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to get customer');
    }

    return response.json();
  }

  async getCustomerAccounts(customerId: number, page: number = 1, pageSize: number = 10): Promise<AccountsResponse> {
    const response = await fetch(`${this.baseUrl}/customers/${customerId}/accounts?page=${page}&page_size=${pageSize}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to get customer accounts');
    }

    return response.json();
  }

  async getCustomerCards(customerId: number, page: number = 1, pageSize: number = 10): Promise<CardsResponse> {
    const response = await fetch(`${this.baseUrl}/customers/${customerId}/cards?page=${page}&page_size=${pageSize}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to get customer cards');
    }

    return response.json();
  }

  async getCustomerTransactions(customerId: number, page: number = 1, pageSize: number = 10): Promise<TransactionsResponse> {
    const response = await fetch(`${this.baseUrl}/customers/${customerId}/transactions?page=${page}&page_size=${pageSize}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to get customer transactions');
    }

    return response.json();
  }

  async getCustomerLoans(customerId: number, page: number = 1, pageSize: number = 10): Promise<LoansResponse> {
    const response = await fetch(`${this.baseUrl}/customers/${customerId}/loans?page=${page}&page_size=${pageSize}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to get customer loans');
    }

    return response.json();
  }

  async getDeposits(lang: string = 'ky'): Promise<DepositsResponse> {
    const response = await fetch(`${this.baseUrl}/knowledge/deposits?lang=${lang}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to get deposits');
    }

    return response.json();
  }

  async getDepositDetails(depositName: string, lang: string = 'ky'): Promise<DepositResponse> {
    const response = await fetch(`${this.baseUrl}/knowledge/deposits/${depositName}?lang=${lang}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to get details for deposit ${depositName}`);
    }

    return response.json();
  }

  async updateDepositDetails(depositName: string, data: DepositResponse, lang: string = 'ky'): Promise<DepositResponse> {
    const response = await fetch(`${this.baseUrl}/knowledge/deposits/${depositName}?lang=${lang}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ [depositName]: data }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update deposit ${depositName}`);
    }

    return response.json();
  }

  async getFAQCategories(lang: string = 'ky'): Promise<FAQCategoriesResponse> {
    const response = await fetch(`${this.baseUrl}/knowledge/info/categories?lang=${lang}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to get FAQ categories');
    }

    return response.json();
  }

  async getFAQByCategory(category: string, lang: string = 'ky', page: number = 1, pageSize: number = 10): Promise<FAQResponse> {
    const response = await fetch(`${this.baseUrl}/knowledge/info/${category}?lang=${lang}&page=${page}&page_size=${pageSize}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to get FAQ for category ${category}`);
    }

    return response.json();
  }


  async updateFAQItem(category: string, id: number, data: FAQItem, lang: string = 'ky'): Promise<UpdateFAQResponse> {
    const response = await fetch(`${this.baseUrl}/knowledge/info/${category}/${id}?lang=${lang}`, {
      method: 'PATCH',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update FAQ item ${id} in category ${category}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();