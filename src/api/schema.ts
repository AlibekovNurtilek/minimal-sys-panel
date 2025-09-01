import {API_BASE_URL} from "@/config"
const BASE_URL = `${API_BASE_URL}/api/admin`;

export interface Schema {
  name: string;
  description: string;
}

export interface SchemasResponse {
  schemas: Schema[];
  total: number;
  page: number;
  page_size: number;
}

export interface UpdateSchemaResponse {
  status: string;
}

class SchemasApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async getSchemas(lang: string = 'ky', page: number = 1, pageSize: number = 10): Promise<SchemasResponse> {
    const response = await fetch(`${this.baseUrl}/knowledge/schemas?lang=${lang}&page=${page}&page_size=${pageSize}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to get schemas');
    }

    return response.json();
  }

  async updateSchema(data: Schema, lang: string = 'ky'): Promise<UpdateSchemaResponse> {
    const response = await fetch(`${this.baseUrl}/knowledge/schemas?lang=${lang}`, {
      method: 'PATCH',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update schema ${data.name}`);
    }

    return response.json();
  }
}

export const schemasApiClient = new SchemasApiClient();