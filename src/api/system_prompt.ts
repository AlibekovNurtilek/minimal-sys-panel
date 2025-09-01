// src/api/system_prompt.ts
import {API_BASE_URL} from "@/config"
const BASE_URL = `${API_BASE_URL}/api/admin`;

export interface Prompt {
  key: string;
  template: string;
}

export interface PromptResponse {
  key: string;
  template: string;
}

export interface UpdatePromptResponse {
  status: string;
}

// Реальный ответ от сервера — массив строк
export type PromptsResponse = string[];

class PromptsApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async getPrompts(lang: string = 'ky'): Promise<PromptsResponse> {
    const response = await fetch(`${this.baseUrl}/knowledge/prompts?lang=${lang}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to get prompts');
    }

    return response.json(); // вернёт string[]
  }

  async getPrompt(key: string, lang: string = 'ky'): Promise<PromptResponse> {
    const response = await fetch(`${this.baseUrl}/knowledge/prompts/${key}?lang=${lang}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to get prompt ${key}`);
    }

    return response.json();
  }

  async updatePrompt(data: Prompt, lang: string = 'ky'): Promise<UpdatePromptResponse> {
    const response = await fetch(`${this.baseUrl}/knowledge/prompts/${data.key}?lang=${lang}`, {
      method: 'PATCH',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update prompt ${data.key}`);
    }

    return response.json();
  }
}

export const promptsApiClient = new PromptsApiClient();
