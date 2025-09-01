import React, { useEffect, useState } from 'react';
import { getCards } from '@/api/knowledge';
import { CardsResponse } from '@/types/knowledge';
import { useTranslation } from 'react-i18next';

const CardsList: React.FC = () => {
  const { i18n } = useTranslation();
  const [cards, setCards] = useState<CardsResponse['cards']>({});
  const [loading, setLoading] = useState(true);

  type Lang = 'ru' | 'ky';
  const getValidLanguage = (lng: string): Lang =>
    lng === 'ru' || lng === 'ky' ? lng : 'ru';

  const lang: Lang = getValidLanguage(i18n.language);

  const labels = {
    ru: { title: 'Список карт' },
    ky: { title: 'Карталар тизмеси' },
  };

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      const data = await getCards(lang);
      if (data) setCards(data.cards);
      setLoading(false);
    };

    fetchCards();
  }, [lang]);

  if (loading) {
    return <div className="text-center mt-10 text-gray-400">Загрузка карт...</div>;
  }

  // Темные градиенты для карточек
  const getCardGradient = (key: string) => {
    if (key.toLowerCase().includes('visa')) return 'bg-gradient-to-r from-blue-900 to-blue-700';
    if (key.toLowerCase().includes('mastercard')) return 'bg-gradient-to-r from-red-900 to-yellow-800';
    if (key.toLowerCase().includes('virtual')) return 'bg-gradient-to-r from-gray-800 to-gray-700';
    if (key.toLowerCase().includes('elkart')) return 'bg-gradient-to-r from-green-900 to-green-700';
    return 'bg-gradient-to-r from-purple-900 to-pink-800';
  };

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 ">{labels[lang].title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Object.entries(cards).map(([key, name]) => (
          <div
            key={key}
            className={`rounded-2xl p-8 h-[150px] shadow-2xl text-white ${getCardGradient(
              key
            )} transform hover:scale-105 transition-transform duration-300`}
          >
            <h3 className="font-bold text-lg mb-2">{name}</h3>
            <p className="text-sm opacity-70">{key}</p>
          
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardsList;
