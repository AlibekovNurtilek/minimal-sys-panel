const BASE_URL = 'http://localhost:8000/api/admin';

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
}

export const apiClient = new ApiClient();