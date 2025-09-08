import { AboutUs, CardDetail, CardsResponse, LoanApplicationProcess, LoanProduct, RequiredDocuments, SpecialOffer, SpecialProgram, Subcategory } from "@/types/knowledge";

import {API_BASE_URL} from "@/config"
const BASE_URL = `${API_BASE_URL}/api/admin/knowledge`;

//AboutUs
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
    body: JSON.stringify({ about_us: about }), // <- сервер ожидает именно "about_us"
  });

  if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
  const data = await response.json();
  return data.about_us;
};


//Cards
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

    // API возвращает { "Mastercard_Standard_Credit": {...} }
    const cardData = data[card_name]; // получаем объект CardDetail по ключу

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


// Loans
export const getLoanApplicationProcess = async (lang: string): Promise<LoanApplicationProcess | null> => {
  try {
    const res = await fetch(`${BASE_URL}/loans/application-process?lang=${lang}`);
    if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
    const data = await res.json();
    return data || null;
  } catch (err) {
    console.error("Ошибка при получении loan_application_process:", err);
    return null;
  }
};

export const updateLoanApplicationProcess = async (
  lang: string,
  payload: Partial<LoanApplicationProcess>
): Promise<LoanApplicationProcess | null> => {
  try {
    const res = await fetch(`${BASE_URL}/loans/application-process?lang=${lang}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Ошибка обновления: ${res.status}`);

    const data = await res.json();
    return data || null;
  } catch (err) {
    console.error("Ошибка при обновлении loan_application_process:", err);
    return null;
  }
};


export const getRequiredDocuments = async (lang: string): Promise<RequiredDocuments | null> => {
  try {
    const res = await fetch(`${BASE_URL}/loans/required-documents?lang=${lang}`);
    if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
    const data = await res.json();
    return data || null;
  } catch (err) {
    console.error("Ошибка при получении required_documents:", err);
    return null;
  }
};

export const updateRequiredDocuments = async (
  lang: string,
  payload: RequiredDocuments
): Promise<RequiredDocuments | null> => {
  try {
    const res = await fetch(`${BASE_URL}/loans/required-documents?lang=${lang}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload), // отправляем полный объект
    });

    if (!res.ok) throw new Error(`Ошибка обновления: ${res.status}`);

    const data = await res.json();
    return data || null;
  } catch (err) {
    console.error("Ошибка при обновлении required-documents:", err);
    return null;
  }
};





export const getLoanProducts = async (lang: string): Promise<LoanProduct[]> => {
  try {
    const res = await fetch(`${BASE_URL}/loans/loan-products?lang=${lang}`);
    if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
    const data = await res.json();
    return data || [];
  } catch (err) {
    console.error("Ошибка при получении loan_products:", err);
    return [];
  }
};



export const getSubcategories=async(loan_type: string, lang:string): Promise<Subcategory[]> =>{
  try {
    const response = await fetch(`${BASE_URL}/loans/loan-products/${loan_type}/subcategories?lang=${lang}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Ошибка при получении подкатегорий');
    }

    const data: Subcategory[] = await response.json();
    return data;
  } catch (error: any) {
    console.error('getSubcategories error:', error.message);
    throw error;
  }
}



export const getSpecialOffers = async (
  loan_type: string,
  lang:string
): Promise<Record<string, SpecialOffer[]>> => {
  try {
    const response = await fetch(
      `${BASE_URL}/loans/loan-products/${loan_type}/special-offers?lang=${lang}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.detail || "Ошибка при получении специальных предложений"
      );
    }

    // API возвращает объект с городами
    const data: Record<string, SpecialOffer[]> = await response.json();
    return data;
  } catch (error: any) {
    console.error("getSpecialOffers error:", error.message);
    throw error;
  }
};




export const getSpecialPrograms=async(loan_type: string,lang:string): Promise<SpecialProgram[]> =>{
  try {
    const response = await fetch(`${BASE_URL}/loans/loan-products/${loan_type}/special-programs?lang=${lang}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Ошибка при получении подкатегорий');
    }

    const data: SpecialProgram[] = await response.json();
    return data;
  } catch (error: any) {
    console.error('fetchSubcategories error:', error.message);
    throw error;
  }
}


import { LoanUpdatePayload } from "@/types/knowledge";

/**
 * Обновление данных кредита через PATCH
 * @param loanType - тип кредита
 * @param data - объект с обновленными данными
 */
export const updateLoanData = async (loanType: string, data: LoanUpdatePayload) => {
  try {
    const response = await fetch(`/api/loans/${loanType}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Ошибка при обновлении данных кредита");
    }

    return await response.json(); // возвращаем новые данные
  } catch (err) {
    console.error("Ошибка при обновлении данных кредита:", err);
    throw err;
  }
};
