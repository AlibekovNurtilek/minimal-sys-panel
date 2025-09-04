import {API_BASE_URL} from "@/config"
const BASE_URL = `${API_BASE_URL}/api/admin`;

export interface Application {
  id: number;
  customer_id: number;
  loan_type: string;
  amount: number;
  term_months: number;
  interest_rate: number;
  own_contribution: number;
  collateral: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  birth_date: string;
  passport_number: string;
  phone_number: string;
  email: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface LoanApplication {
  application: Application;
  customer: Customer;
  loan_info: any; // Using any as per requirement that loan_info has no fixed structure
}

export interface LoanApplicationsResponse {
  items: LoanApplication[];
  page: number;
  page_size: number;
  total: number;
}

export interface UpdateLoanStatusData {
  status: string;
}

export interface UpdateLoanStatusResponse extends Application {}

class LoanApplicationsApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async getLoanApplications(page: number = 1, page_size: number = 10): Promise<LoanApplicationsResponse> {
    const response = await fetch(`${this.baseUrl}/applications/loans?page=${page}&page_size=${page_size}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch loan applications');
    }

    return response.json();
  }

  async updateLoanStatus(id: number, data: UpdateLoanStatusData): Promise<UpdateLoanStatusResponse> {
    const response = await fetch(`${this.baseUrl}/applications/loans/${id}`, {
      method: 'PATCH',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update loan application ${id}`);
    }

    return response.json();
  }
}

export const loanApplicationsApiClient = new LoanApplicationsApiClient();