import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCardByName } from '@/api/knowledge';
import { CardDetail } from '@/types/knowledge';
import { useTranslation } from 'react-i18next';
import { labels, Lang } from '@/constants/labels';

const CardDetailPage: React.FC = () => {
  const { i18n } = useTranslation();
  const { card_name } = useParams<{ card_name: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<CardDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getValidLanguage = (lng: string): Lang => (lng === 'ru' || lng === 'ky' ? lng : 'ru');
  const lang: Lang = getValidLanguage(i18n.language);
  const l = labels[lang];

  useEffect(() => {
    const fetchCard = async () => {
      if (!card_name) {
        setError(l.cardNotFound);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const decodedName = decodeURIComponent(card_name);
        const data = await getCardByName(lang, decodedName);
        if (data) setCard(data);
        else setError(l.cardNotFound);
      } catch (err) {
        console.error(err);
        setError(l.error);
      } finally {
        setLoading(false);
      }
    };
    fetchCard();
  }, [card_name, lang, l.cardNotFound, l.error]);

  if (loading) return <div className="p-6 max-w-5xl mx-auto text-center">{l.loading}</div>;
  if (error || !card) return (
    <div className="p-6 max-w-5xl mx-auto">
      <button onClick={() => navigate('/knowledge/cards')} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        ← {l.backToList}
      </button>
      <p className="text-red-500">{error || l.error}</p>
    </div>
  );

  const getCardGradient = (cardName: string, cardKey: string) => {
    const searchText = `${cardName} ${cardKey}`.toLowerCase();
    if (searchText.includes('visa')) return 'bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500';
    if (searchText.includes('mastercard')) return 'bg-gradient-to-br from-red-900 via-orange-700 to-yellow-600';
    if (searchText.includes('virtual')) return 'bg-gradient-to-br from-gray-800 via-gray-600 to-gray-500';
    if (searchText.includes('elkart')) return 'bg-gradient-to-br from-green-900 via-green-700 to-green-500';
    return 'bg-gradient-to-br from-purple-900 via-pink-700 to-indigo-600';
  };

  const RenderField: React.FC<{ label: string; value: any; fieldKey?: string }> = ({ label, value, fieldKey }) => {
    if (value == null) return null;

    // Инструкции — нумерованный список на одной линии
    if (fieldKey === 'instructions' && Array.isArray(value)) {
      return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col">
          <div className="font-semibold text-gray-600 text-sm uppercase tracking-wide">{label}</div>
          <div className="mt-1 flex flex-col gap-1">
            {value.map((v, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="font-semibold">{i + 1}.</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Ставки — кружки
    if (fieldKey === 'rates' && Array.isArray(value)) {
      return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col">
          <div className="font-semibold text-gray-600 text-sm uppercase tracking-wide">{label}</div>
          <div className="mt-1 flex flex-wrap gap-2">
            {value.map((v, i) => (
              <div key={i} className="bg-blue-500 text-white rounded-full px-4 py-2 text-sm font-medium">
                {v}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Строки и числа
    if (typeof value === 'string' || typeof value === 'number') {
      return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col">
          <div className="font-semibold text-gray-600 text-sm uppercase tracking-wide">{label}</div>
          <div className="mt-1 text-gray-900 font-medium">{value}</div>
        </div>
      );
    }

    // Массивы
    if (Array.isArray(value)) {
      return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col">
          <div className="font-semibold text-gray-600 text-sm uppercase tracking-wide">{label}</div>
          <div className="mt-1 flex flex-wrap gap-2">
            {value.map((v, i) => (
              <div key={i} className="text-gray-900 font-medium bg-white p-2 rounded border">{typeof v === 'object' ? JSON.stringify(v) : v}</div>
            ))}
          </div>
        </div>
      );
    }

    // Объекты
    if (typeof value === 'object') {
      return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col">
          <div className="font-semibold text-gray-600 text-sm uppercase tracking-wide">{label}</div>
          <div className="mt-1 flex flex-col gap-2">
            {Object.entries(value).map(([k, v]) => (
              <RenderField key={k} label={labels[lang][k] || k} value={v} fieldKey={k} />
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <button onClick={() => navigate('/knowledge/cards')} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        ← {l.backToList}
      </button>

      <div className={`${getCardGradient(card.name, card_name || '')} rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white bg-opacity-5 rounded-full translate-y-10 -translate-x-10"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">{card.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          'currency','validity','issuance','annual_fee',
          'annual_fee_payroll_first_year','annual_fee_payroll_next_years',
          'payroll_limit','collateral','interest_rate_atm_cash','interest_rate_pos',
          'grace_period','additional_card','card_min_limit'
        ].map(key => (
          <RenderField key={key} label={l[key] || key} value={card[key]} fieldKey={key} />
        ))}

        {card.limits && <RenderField label={l.limits} value={card.limits} fieldKey="limits" />}
        {card.Services && <RenderField label={l.Services} value={card.Services} />}
        {card.instructions && <RenderField label={l.instructions} value={card.instructions} fieldKey="instructions" />}
        {card.rates && <RenderField label={l.rates} value={card.rates} fieldKey="rates" />}
        {card.benefits && <RenderField label={l.benefits} value={card.benefits} />}
        {card.conditions && <RenderField label={l.conditions} value={card.conditions} />}
      </div>

      {card.descr && (
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{l.description}</h2>
          <p className="text-gray-700">{card.descr}</p>
        </div>
      )}
    </div>
  );
};

export default CardDetailPage;
