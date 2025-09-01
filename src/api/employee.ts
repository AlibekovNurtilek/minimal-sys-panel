// src/api/employees.ts
import {API_BASE_URL} from "@/config"
const BASE_URL = `${API_BASE_URL}/api/admin`;

export interface Employee {
  id: number;
  username: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeesResponse {
  items: Employee[];
  page: number;
  page_size: number;
  total: number;
}

export interface CreateEmployeeData {
  username: string;
  password: string;
}

export interface CreateEmployeeResponse extends Employee {}

class EmployeesApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async getEmployees(page: number = 1, page_size: number = 10): Promise<EmployeesResponse> {
    const response = await fetch(`${this.baseUrl}/employees?page=${page}&page_size=${page_size}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }

    return response.json();
  }

  async createEmployee(data: CreateEmployeeData): Promise<CreateEmployeeResponse> {
    const response = await fetch(`${this.baseUrl}/employees`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create employee');
    }

    return response.json();
  }

  async deleteEmployee(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/employees/${id}`, {
      method: 'DELETE',
      headers: {
        'accept': '*/*',
      },
      credentials: 'include',
    });

    if (!response.ok && response.status !== 204) {
      throw new Error(`Failed to delete employee ${id}`);
    }
  }
}

export const employeesApiClient = new EmployeesApiClient();
