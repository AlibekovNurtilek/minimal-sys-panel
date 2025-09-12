import React, { useEffect, useState } from 'react';
import { getCards } from '@/api/knowledge';
import { CardDetail, CardsResponse } from '@/types/knowledge';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from "@/components/PageHeader";
import { t } from 'i18next';

const CardsList: React.FC = () => {
  const { i18n } = useTranslation();
  const [cards, setCards] = useState<Record<string, CardDetail>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  type Lang = 'ru' | 'ky';
  const getValidLanguage = (lng: string): Lang =>
    lng === 'ru' || lng === 'ky' ? lng : 'ru';

  const [lang, setLang] = useState<Lang>(getValidLanguage(i18n.language));

  const labels = {
    ru: { 
      title: 'Управление банковскими картами',
      loading: 'Загрузка карт...',
      error: 'Ошибка загрузки карт',
      debit: 'Дебетовые карты',
      credit: 'Кредитные карты',
      special: 'Специальные карты',
      totalCards: 'карт'
    },
    ky: { 
      title: 'Банк карталарын башкаруу',
      loading: 'Карталар жүктөлүүдө...',
      error: 'Карталарды жүктөөдө ката',
      debit: 'Дебеттик карталар',
      credit: 'Кредиттик карталар',
      special: 'Өзгөчө карталар',
      totalCards: 'карта'
    },
  };

  useEffect(() => {
    setLang(getValidLanguage(i18n.language));
  }, [i18n.language]);

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

  // Функция для получения иконки карты
  const getCardIcon = (key: string) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('visa')) return '💳';
    if (lowerKey.includes('mastercard')) return '💴';
    if (lowerKey.includes('virtual')) return '🌐';
    if (lowerKey.includes('elkart')) return '🏦';
    if (lowerKey.includes('campus')) return '🎓';
    if (lowerKey.includes('plus')) return '⭐';
    return '💳';
  };

  // Функция для получения цвета и градиента карты
  const getCardStyle = (key: string) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('visa')) {
      if (lowerKey.includes('platinum')) return 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 border-slate-600';
      if (lowerKey.includes('gold')) return 'bg-gradient-to-br from-yellow-600 via-yellow-500 to-amber-700 border-yellow-500';
      return 'bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 border-blue-600';
    }
    if (lowerKey.includes('mastercard')) {
      if (lowerKey.includes('platinum')) return 'bg-gradient-to-br from-gray-800 via-gray-700 to-black border-gray-600';
      if (lowerKey.includes('gold')) return 'bg-gradient-to-br from-yellow-600 via-yellow-500 to-amber-700 border-yellow-500';
      return 'bg-gradient-to-br from-red-700 via-orange-600 to-red-800 border-red-600';
    }
    if (lowerKey.includes('virtual')) return 'bg-gradient-to-br from-purple-800 via-purple-700 to-indigo-900 border-purple-600';
    if (lowerKey.includes('elkart')) return 'bg-gradient-to-br from-green-800 via-green-700 to-emerald-900 border-green-600';
    if (lowerKey.includes('campus')) return 'bg-gradient-to-br from-cyan-800 via-cyan-700 to-blue-900 border-cyan-600';
    if (lowerKey.includes('plus')) return 'bg-gradient-to-br from-pink-800 via-rose-700 to-pink-900 border-pink-600';
    return 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 border-gray-600';
  };

  // Функция для группировки карт
  const groupCards = () => {
    const grouped = {
      debit: {} as Record<string, CardDetail>,
      credit: {} as Record<string, CardDetail>,
      special: {} as Record<string, CardDetail>
    };

    Object.entries(cards).forEach(([key, card]) => {
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('debit')) {
        grouped.debit[key] = card;
      } else if (lowerKey.includes('credit')) {
        grouped.credit[key] = card;
      } else {
        grouped.special[key] = card;
      }
    });

    return grouped;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-400 text-lg">{labels[lang].loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  const groupedCards = groupCards();

  const renderCardGroup = (title: string, cardsGroup: Record<string, CardDetail>) => {
    if (Object.keys(cardsGroup).length === 0) return null;

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {Object.keys(cardsGroup).length} {labels[lang].totalCards}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(cardsGroup).map(([key, card]) => (
            <div
              key={key}
              className={`relative rounded-2xl h-40 p-6 shadow-lg border-2 text-white transform hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer group ${getCardStyle(key)}`}
              onClick={() => navigate(`/cards/${encodeURIComponent(key)}`)}
            >
              {/* Фоновый паттерн */}
              <div className="absolute inset-0 opacity-10 rounded-2xl">
                <div className="absolute top-4 right-4 text-4xl opacity-50">
                  {getCardIcon(key)}
                </div>
                <div className="absolute bottom-2 left-2 w-8 h-8 bg-white opacity-20 rounded-full"></div>
                <div className="absolute bottom-4 left-8 w-4 h-4 bg-white opacity-30 rounded-full"></div>
              </div>
              
              {/* Контент карты */}
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{getCardIcon(key)}</span>
                    <div className="opacity-75 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </div>
                  <h4 className="font-bold text-lg leading-tight mb-1">
                    {card.name || key.replace(/_/g, ' ')}
                  </h4>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs opacity-80 font-mono tracking-wider">
                    {key.replace(/_/g, ' ').toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Эффект при ховере */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 min-h-screen max-w-7xl mx-auto bg-gray-50">
      {/* Заголовок */}
      <div className="mb-8">
        <PageHeader
          title={labels[lang].title}
          description={t('dashboard.features.cardInfo.description')}
        />
      </div>

      {/* Группы карт */}
      {renderCardGroup(labels[lang].debit, groupedCards.debit)}
      {renderCardGroup(labels[lang].credit, groupedCards.credit)}
      {renderCardGroup(labels[lang].special, groupedCards.special)}

      {Object.keys(cards).length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4 opacity-50">💳</div>
          <p className="text-gray-500 text-lg">Карты не найдены</p>
        </div>
      )}
    </div>
  );
};

export default CardsList;