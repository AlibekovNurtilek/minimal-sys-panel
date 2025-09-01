
const BASE_URL = 'http://localhost:8000/api/admin/knowledge';

export interface AboutUs {
  bank_name: string;
  founded: string;
  license: string;
  mission: string;
  values: string[];
  ownership: {
    main_shareholder: string;
    country: string;
    ownership_percentage: string;
  };
  branches: {
    head_office: string;
    regions: string[];
  };
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  descr: string;
}

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

