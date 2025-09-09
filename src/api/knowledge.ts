import { AboutUs, CardDetail, CardsResponse } from "@/types/knowledge";
import {API_BASE_URL} from "@/config"
const BASE_URL = `${API_BASE_URL}/api/admin/knowledge`;

// Existing AboutUs functions (unchanged)
export const getAboutInfo = async (lang: string): Promise<AboutUs> => {
  const response = await fetch(`${BASE_URL}/about-us?lang=${lang}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Ошибка: ${response.status}`);
  }

  const data = await response.json();
  return data.about_us; 
};

export const updateAboutInfo = async (about: AboutUs, lang: string = "ky"): Promise<AboutUs> => {
  const response = await fetch(`${BASE_URL}/about-us?lang=${lang}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ about_us: about }),
  });

  if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
  const data = await response.json();
  return data.about_us;
};

// Existing Cards functions (unchanged)
export const getCards = async (lang: string): Promise<CardsResponse | null> => {
  try {
    const response = await fetch(`${BASE_URL}/cards?lang=${lang}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error(`Ошибка: ${response.status}`);

    const data = await response.json();
    return { cards: data.cards }; 
  } catch (error) {
    console.error('Ошибка при получении карт:', error);
    return null;
  }
};

export const getCardByName = async (
  lang: string,
  card_name: string
): Promise<CardDetail | null> => {
  try {
    const response = await fetch(`${BASE_URL}/cards/${card_name}?lang=${lang}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error(`Ошибка: ${response.status}`);

    const data = await response.json();
    const cardData = data[card_name];
    return cardData || null;
  } catch (error) {
    console.error('Ошибка при получении карты:', error);
    return null;
  }
};

export const updateCard = async (lang: string, cardName: string, cardData: Record<string, any>) => {
  const response = await fetch(`${BASE_URL}/cards/${encodeURIComponent(cardName)}?lang=${lang}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },
    body: JSON.stringify({ [cardName]: cardData }),
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Ошибка обновления: ${response.status} ${errText}`);
  }
  return response.json();
};

// New Loan-related functions
export const getLoanProductNames = async (lang: string = "ky"): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/loans?lang=${lang}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }

    const data = await response.json();
    return data; // Returns array of { type, name }
  } catch (error) {
    console.error('Ошибка при получении списка loan_products:', error);
    throw error;
  }
};

export const getLoanProductByType = async (lang: string = "ky", productType: string): Promise<any> => {
  try {
    if (!productType) {
      throw new Error('Тип продукта не указан');
    }

    const response = await fetch(`${BASE_URL}/loans/${encodeURIComponent(productType)}?lang=${lang}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Ошибка: ${response.status} ${errText}`);
    }

    const data = await response.json();
    return data; // Returns the loan product object
  } catch (error) {
    console.error(`Ошибка при получении loan_product с типом ${productType}:`, error);
    throw error;
  }
};

export const updateLoanProduct = async (lang: string = "ky", productType: string, productData: any): Promise<any> => {
  try {
    if (!productType) {
      throw new Error('Тип продукта не указан');
    }
    if (!productData || productData.type !== productType) {
      throw new Error('Тип в данных должен совпадать с указанным типом');
    }

    const response = await fetch(`${BASE_URL}/loans/${encodeURIComponent(productType)}?lang=${lang}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Ошибка обновления: ${response.status} ${errText}`);
    }

    const data = await response.json();
    return data; // Returns the updated loan product
  } catch (error) {
    console.error(`Ошибка при обновлении loan_product с типом ${productType}:`, error);
    throw error;
  }
};