import React, { useEffect, useState } from 'react';
import { getCards } from '@/api/knowledge';
import { CardDetail, CardsResponse } from '@/types/knowledge';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const CardsList: React.FC = () => {
  const { i18n } = useTranslation();
  const [cards, setCards] = useState<Record<string, CardDetail>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  type Lang = 'ru' | 'ky';
  const getValidLanguage = (lng: string): Lang =>
    lng === 'ru' || lng === 'ky' ? lng : 'ru';

  const lang: Lang = getValidLanguage(i18n.language);

  const labels = {
    ru: { 
      title: 'Список карт',
      loading: 'Загрузка карт...',
      error: 'Ошибка загрузки карт'
    },
    ky: { 
      title: 'Карталар тизмеси',
      loading: 'Карталар жүктөлүүдө...',
      error: 'Карталарды жүктөөдө ката'
    },
  };

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        setError(null);
        const data: CardsResponse = await getCards(lang);
        if (data?.cards) {
          setCards(data.cards);
        }
      } catch (err) {
        console.error('Error fetching cards:', err);
        setError(labels[lang].error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [lang]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-400">
        {labels[lang].loading}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-400">
        {error}
      </div>
    );
  }

  // Темные градиенты для карточек
  const getCardGradient = (key: string) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('visa')) return 'bg-gradient-to-r from-blue-900 to-blue-700';
    if (lowerKey.includes('mastercard')) return 'bg-gradient-to-r from-red-900 to-yellow-800';
    if (lowerKey.includes('virtual')) return 'bg-gradient-to-r from-gray-800 to-gray-700';
    if (lowerKey.includes('elkart')) return 'bg-gradient-to-r from-green-900 to-green-700';
    return 'bg-gradient-to-r from-purple-900 to-pink-800';
  };

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">{labels[lang].title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Object.entries(cards).map(([key, card]) => (
          <div
            key={key}
            className={`rounded-2xl p-6 shadow-2xl text-white ${getCardGradient(key)} transform hover:scale-105 transition-transform duration-300 cursor-pointer`}
            onClick={() => navigate(`/cards/${encodeURIComponent(key)}`)}
          >
            <h3 className="font-bold text-lg mb-2">{card.name}</h3>
            <p className="text-sm opacity-70">{key}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardsList;