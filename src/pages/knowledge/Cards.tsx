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
    return <div className="text-center mt-10 text-gray-500">Загрузка карт...</div>;
  }

  return (
    <div className="p-6 cursor-pointer" >
      <h2 className="text-2xl font-bold mb-6">{labels[lang].title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(cards).map(([key, name]) => (
          <div
            key={key}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition-shadow duration-300 bg-white"
          >
            <h3 className="font-semibold text-lg mb-2">{name}</h3>
            <p className="text-gray-400 text-sm">{key}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardsList;
