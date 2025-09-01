import { AboutUs, CardDetail, CardsResponse } from "@/types/knowledge";

const BASE_URL = 'http://localhost:8000/api/admin/knowledge';

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

export const updateAboutInfo = async (about: AboutUs): Promise<AboutUs> => {
  const response = await fetch(`${BASE_URL}/about-us`, {
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
