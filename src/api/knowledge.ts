import { AboutUs, CardsResponse } from "@/types/knowledge";

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
