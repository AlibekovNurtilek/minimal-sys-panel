import React, { useEffect, useState } from 'react';
import { getAboutInfo, updateAboutInfo } from '@/api/knowledge';
import { useTranslation } from 'react-i18next';
import EditBtn from '@/components/EditBtn';
import { AboutUs } from '@/types/knowledge';
import { PageHeader } from "@/components/PageHeader";
import { t } from 'i18next';

type Lang = 'ru' | 'ky';
const getValidLanguage = (lng: string): Lang =>
  lng === 'ru' || lng === 'ky' ? lng : 'ru';

const AdminAbout: React.FC = () => {
  const { i18n } = useTranslation();
  const [about, setAbout] = useState<AboutUs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Lang>(getValidLanguage(i18n.language));
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const labels = {
    ru: {
      title: 'О нас', edit: 'Редактировать', save: 'Сохранить',
      founded: 'Основан', license: 'Лицензия', mission: 'Миссия', values: 'Ценности',
      owner: 'Владелец', branches: 'Филиалы', headOffice: 'Головной офис',
      contacts: 'Контакты', phone: 'Телефон', email: 'Email', address: 'Адрес',
      loading: 'Загрузка...', error: 'Ошибка при загрузке информации о банке'
    },
    ky: {
      title: 'Биз жөнүндө', edit: 'Түзөтүү', save: 'Сактоо',
      founded: 'Негизделген', license: 'Лицензия', mission: 'Миссия', values: 'Баалуулуктар',
      owner: 'Ээ', branches: 'Филиалдар', headOffice: 'Башкы офис',
      contacts: 'Контакттар', phone: 'Телефон', email: 'Электрондук почта', address: 'Дарек',
      loading: 'Жүктөлүүдө...', error: 'Банка тууралуу маалыматты жүктөөдө ката кетти'
    }
  };

  useEffect(() => {
    const fetchAbout = async () => {
      setLoading(true);
      try {
        const data = await getAboutInfo(language);
        setAbout(data);
      } catch {
        setError(labels[language].error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, [language]);

  useEffect(() => {
    const handleLanguageChanged = (lng: string) => setLanguage(getValidLanguage(lng));
    i18n.on('languageChanged', handleLanguageChanged);
    return () => i18n.off('languageChanged', handleLanguageChanged);
  }, [i18n]);

const handleSave = async () => {
  if (!about) return;
  setSaving(true);
  try {
    const updated = await updateAboutInfo(about, language); 
    setAbout(prev => ({
      ...prev,
      ...updated, // Обновляем все поля, пришедшие с сервера
    }));
    setEditMode(false);
  } catch {
    setError('Ошибка при сохранении данных');
  } finally {
    setSaving(false);
  }
};


  if (loading) return <p className="text-center text-gray-600">{labels[language].loading}</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const l = labels[language];

  return (
    <div className=' max-w-7xl mx-auto'>
      <PageHeader
            title={t('nav.about')}
          />

      <div className="p-6 mt-4 bg-white shadow-xl rounded-2xl space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800"></h1>
          <EditBtn
            editMode={editMode}
            saving={saving}
            onEdit={() => setEditMode(true)}
            onSave={handleSave}
            labels={{ edit: l.edit, save: l.save }}
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-xl shadow-sm space-y-2">
          {editMode ? (
            <input
              className="w-full border rounded p-2"
              value={about?.bank_name || ''}
              onChange={(e) => setAbout(prev => prev ? { ...prev, bank_name: e.target.value } : null)}
            />
          ) : <h2 className="text-xl font-semibold">{about?.bank_name}</h2>}

          <p>
            <strong>{l.founded}:</strong>{' '}
            {editMode ? (
              <input
                className="border rounded p-1"
                value={about?.founded || ''}
                onChange={(e) => setAbout(prev => prev ? { ...prev, founded: e.target.value } : null)}
              />
            ) : about?.founded}
          </p>

          <p>
            <strong>{l.license}:</strong>{' '}
            {editMode ? (
              <input
                className="border rounded p-1 w-full"
                value={about?.license || ''}
                onChange={(e) => setAbout(prev => prev ? { ...prev, license: e.target.value } : null)}
              />
            ) : about?.license}
          </p>

          <p>
            <strong>{l.mission}:</strong>{' '}
            {editMode ? (
              <textarea
                className="border rounded p-1 w-full"
                value={about?.mission || ''}
                onChange={(e) => setAbout(prev => prev ? { ...prev, mission: e.target.value } : null)}
              />
            ) : about?.mission}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-2">{l.values}</h3>
          {editMode ? (
            <div className="space-y-1">
              {about?.values.map((val, i) => (
                <input
                  key={i}
                  className="w-full border rounded p-1"
                  value={val}
                  onChange={(e) => {
                    const newValues = about.values.slice();
                    newValues[i] = e.target.value;
                    setAbout(prev => prev ? { ...prev, values: newValues } : null);
                  }}
                />
              ))}
            </div>
          ) : (
            <ul className="list-disc list-inside space-y-1">
              {about?.values.map((value, i) => <li key={i}>{value}</li>)}
            </ul>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-2">{l.owner}</h3>
          {editMode ? (
            <div className="space-y-1">
              <input
                className="border rounded p-1 w-full"
                value={about?.ownership.main_shareholder || ''}
                onChange={(e) => setAbout(prev => prev ? { ...prev, ownership: { ...prev.ownership, main_shareholder: e.target.value } } : null)}
              />
              <input
                className="border rounded p-1 w-full"
                value={about?.ownership.country || ''}
                onChange={(e) => setAbout(prev => prev ? { ...prev, ownership: { ...prev.ownership, country: e.target.value } } : null)}
              />
              <input
                className="border rounded p-1 w-full"
                value={about?.ownership.ownership_percentage || ''}
                onChange={(e) => setAbout(prev => prev ? { ...prev, ownership: { ...prev.ownership, ownership_percentage: e.target.value } } : null)}
              />
            </div>
          ) : (
            <p>{about?.ownership.main_shareholder} ({about?.ownership.country}) — {about?.ownership.ownership_percentage}</p>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-2">{l.branches}</h3>
          {editMode ? (
            <div className="space-y-1">
              <input
                className="border rounded p-1 w-full"
                value={about?.branches.head_office || ''}
                onChange={(e) => setAbout(prev => prev ? { ...prev, branches: { ...prev.branches, head_office: e.target.value } } : null)}
              />
              {about?.branches.regions.map((region, i) => (
                <input
                  key={i}
                  className="border rounded p-1 w-full"
                  value={region}
                  onChange={(e) => {
                    const newRegions = about.branches.regions.slice();
                    newRegions[i] = e.target.value;
                    setAbout(prev => prev ? { ...prev, branches: { ...prev.branches, regions: newRegions } } : null);
                  }}
                />
              ))}
            </div>
          ) : (
            <>
              <p><strong>{l.headOffice}:</strong> {about?.branches.head_office}</p>
              <ul className="list-disc list-inside space-y-1">
                {about?.branches.regions.map((region, i) => <li key={i}>{region}</li>)}
              </ul>
            </>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-2">{l.contacts}</h3>
          {editMode ? (
            <div className="space-y-1">
              <input
                className="border rounded p-1 w-full"
                value={about?.contact.phone || ''}
                onChange={(e) => setAbout(prev => prev ? { ...prev, contact: { ...prev.contact, phone: e.target.value } } : null)}
              />
              <input
                className="border rounded p-1 w-full"
                value={about?.contact.email || ''}
                onChange={(e) => setAbout(prev => prev ? { ...prev, contact: { ...prev.contact, email: e.target.value } } : null)}
              />
              <input
                className="border rounded p-1 w-full"
                value={about?.contact.address || ''}
                onChange={(e) => setAbout(prev => prev ? { ...prev, contact: { ...prev.contact, address: e.target.value } } : null)}
              />
            </div>
          ) : (
            <>
              <p><strong>{l.phone}:</strong> {about?.contact.phone}</p>
              <p><strong>{l.email}:</strong> {about?.contact.email}</p>
              <p><strong>{l.address}:</strong> {about?.contact.address}</p>
            </>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
          {editMode ? (
            <textarea
              className="border rounded p-1 w-full"
              value={about?.descr || ''}
              onChange={(e) => setAbout(prev => prev ? { ...prev, descr: e.target.value } : null)}
            />
          ) : (
            <p>{about?.descr}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAbout;
