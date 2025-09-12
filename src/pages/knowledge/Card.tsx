import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCardByName, updateCard } from '@/api/knowledge';
import { CardDetail } from '@/types/knowledge';
import { useTranslation } from 'react-i18next';
import { labels, Lang } from '@/constants/labels';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { PageHeader } from "@/components/PageHeader";

const CardDetailPage: React.FC = () => {
  const { i18n } = useTranslation();
  const { card_name } = useParams<{ card_name: string }>();
  const navigate = useNavigate();

  const [card, setCard] = useState<CardDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getValidLanguage = (lng: string): Lang => (lng === 'ru' || lng === 'ky' ? lng : 'ru');
  const lang: Lang = getValidLanguage(i18n.language);
  const l = labels[lang];

  const { control, handleSubmit, reset, register } = useForm<CardDetail>({ defaultValues: {} });

  // Загрузка карты
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
        if (data) {
          setCard(data);
          reset(data); // заполняем react-hook-form
        } else setError(l.cardNotFound);
      } catch (err) {
        console.error(err);
        setError(l.error);
      } finally {
        setLoading(false);
      }
    };
    fetchCard();
  }, [card_name, lang, l.cardNotFound, l.error, reset]);

  const handleSave = async (data: CardDetail) => {
    if (!card_name) return;
    setSaving(true);
    setError(null);
    try {
      await updateCard(lang, card_name, data);
      setCard(data);
      setEditing(false);
      alert('Карта успешно обновлена');
    } catch (err: any) {
      console.error(err);
      setError(err.message || l.error);
    } finally {
      setSaving(false);
    }
  };

  const getCardGradient = (cardName: string) => {
    const searchText = cardName.toLowerCase();
    if (searchText.includes('visa')) return 'bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500';
    if (searchText.includes('mastercard')) return 'bg-gradient-to-br from-red-900 via-orange-700 to-yellow-600';
    if (searchText.includes('virtual')) return 'bg-gradient-to-br from-gray-800 via-gray-600 to-gray-500';
    if (searchText.includes('elkart')) return 'bg-gradient-to-br from-green-900 via-green-700 to-green-500';
    return 'bg-gradient-to-br from-purple-900 via-pink-700 to-indigo-600';
  };

  if (loading) return <div className="p-6 max-w-5xl mx-auto text-center">{l.loading}</div>;
  if (error || !card) return (
    <div className="p-6 max-w-5xl mx-auto">
      <button onClick={() => navigate('/knowledge/cards')} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        ← {l.backToList}
      </button>
      <p className="text-red-500">{error || l.error}</p>
    </div>
  );

  // Отображение простых и массивных полей в режиме просмотра
  const RenderField: React.FC<{ label: string; value: any }> = ({ label, value }) => {
    if (value == null) return null;

    if (typeof value === 'string' || typeof value === 'number') {
      return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col">
          <div className="font-semibold text-gray-600 text-sm uppercase tracking-wide">{label}</div>
          <div className="mt-1 text-gray-900 font-medium">{value}</div>
        </div>
      );
    }

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

    if (typeof value === 'object') {
      return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col">
          <div className="font-semibold text-gray-600 text-sm uppercase tracking-wide">{label}</div>
          <div className="mt-1 flex flex-col gap-2">
            {Object.entries(value).map(([k, v]) => (
              <RenderField key={k} label={labels[lang][k] || k} value={v} />
            ))}
          </div>
        </div>
      );
    }

    return null;
  };
  
  
const RenderEditableField: React.FC<{ name: string; label: string; value: any }> = ({ name, label, value }) => {
  if (value == null) return null;
  if (name === 'descr') {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col">
        <div className="font-semibold text-gray-600 text-sm uppercase tracking-wide">{label}</div>
        <textarea
          {...register(name as any)}
          className="mt-1 p-3 border rounded resize-none min-h-[150px] text-gray-900"
        />
      </div>
    );
  }
  // Фиксированные массивы (например, currency)
  if (Array.isArray(value) && name === 'currency') {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col">
        <div className="font-semibold text-gray-600 text-sm uppercase tracking-wide">{label}</div>
        {value.map((v, i) => (
          <input
            key={i}
            type="text"
            {...register(`${name}.${i}` as any)}
            className="mt-1 p-2 border rounded mb-1"
          />
        ))}
      </div>
    );
  }

  // Динамические массивы
  if (Array.isArray(value)) {
    const { fields, append, remove } = useFieldArray({ control, name: name as any });
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col">
        <div className="font-semibold text-gray-600 text-sm uppercase tracking-wide">{label}</div>
        {fields.map((field, idx) => (
          <div key={field.id} className="flex gap-2 mt-1">
            <Controller
              name={`${name}.${idx}` as any}
              control={control}
              render={({ field }) => (
                <input {...field} className="flex-1 p-2 border rounded" />
              )}
            />
            <button type="button" onClick={() => remove(idx)} className="px-2 bg-red-500 text-white rounded">–</button>
          </div>
        ))}
        <button type="button" onClick={() => append('')} className="mt-2 px-2 bg-green-500 text-white rounded">+</button>
      </div>
    );
  }

  // Вложенный объект
  if (typeof value === 'object') {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col">
        <div className="font-semibold text-gray-600 text-sm uppercase tracking-wide">{label}</div>
        <div className="mt-1 flex flex-col gap-2">
          {Object.entries(value).map(([k, v]) => (
            <RenderEditableField key={k} name={`${name}.${k}`} label={labels[lang][k] || k} value={v} />
          ))}
        </div>
      </div>
    );
  }

  // Строка или число
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col">
      <div className="font-semibold text-gray-600 text-sm uppercase tracking-wide">{label}</div>
      <input
        type="text"
        {...register(name as any)}
        className="mt-1 p-2 border rounded"
      />
    </div>
  );
};


  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className='flex justify-between items-center'>
      <button onClick={() => navigate('/knowledge/cards')} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        ← {l.backToList}
      </button>
      {!editing && (
            <button onClick={() => setEditing(true)} className="px-4 py-2 bg-yellow-500 text-white  rounded hover:bg-yellow-600">
             {l.edit}
            </button>
          )}
          </div>

      {/* Градиентная карточка */}
      <div className={`${getCardGradient(card.name)} rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white bg-opacity-5 rounded-full translate-y-10 -translate-x-10"></div>
        <div className="relative z-10 flex justify-between items-center">
          <h1 className="text-4xl font-bold mb-2">{card.name}</h1>
          
        </div>
      </div>

      {!editing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(card).map((key) => (
            <RenderField key={key} label={l[key] || key} value={card[key]} />
          ))}
        </div>
      )}

    {editing && (
      <form onSubmit={handleSubmit(handleSave)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(card).map((key) => (
            <RenderEditableField key={key} name={key} label={l[key] || key} value={card[key]} />
          ))}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-4 px-6 py-3 mr-4 bg-blue-500 text-white rounded hover:bg-green-600"
        >
          {saving ? l.saving : l.saveChanges}
        </button>

        <button
          type="button"
          onClick={() => setEditing(false)}
          className="mt-2 px-6 py-3 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          {l.cancel}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
)}

    </div>
  );
};

export default CardDetailPage;
