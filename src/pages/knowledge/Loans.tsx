import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Edit3, CheckCircle, AlertCircle, Loader, ChevronDown, ChevronRight } from 'lucide-react';
import { getLoanProductNames, getLoanProductByType, updateLoanProduct } from '@/api/knowledge';
import { PageHeader } from "@/components/PageHeader";
import { t } from 'i18next';

type JsonEditorProps = {
  data: any;
  onChange: (newData: any) => void;
  path?: string;
  level?: number;
};

const JsonEditor: React.FC<JsonEditorProps> = ({ data, onChange, path = '', level = 0 }) => {
  const { t } = useTranslation();
  // null / undefined
  if (data === null || data === undefined) {
    return (
      <div className="text-gray-400 italic bg-gray-50 px-3 py-2 rounded border-l-4 border-gray-300">
        null
      </div>
    );
  }

  // Примитивы
  if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
    return (
      <div className="flex items-center space-x-2">
        {typeof data === 'boolean' ? (
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data}
              onChange={(e) => onChange(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">{data ? 'true' : 'false'}</span>
          </label>
        ) : (
          <input
            type={typeof data === 'number' ? 'number' : 'text'}
            value={data}
            onChange={(e) => {
              const newValue =
                typeof data === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
              onChange(newValue);
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        )}
      </div>
    );
  }

  // Массивы
  if (Array.isArray(data)) {
    const isPrimitiveArray = data.every(
      (item) => item === null || ['string', 'number', 'boolean'].includes(typeof item)
    );

    return (
      <ul className={`${isPrimitiveArray ? 'list-disc' : 'list-none'} space-y-3 ${level > 0 ? 'ml-8 pl-4' : ''}`}>
        {data.map((item, index) => {
          const handleChange = (newItem: any) => {
            const newArray = [...data];
            newArray[index] = newItem;
            onChange(newArray);
          };

          if (item && typeof item === 'object' && !Array.isArray(item) && 'name' in item) {
            // Используем только item.name для заголовка, id и Object N больше не нужны
            const label = item.name;
            return (
              <li key={index}>
                <AccordionItem label={label}>
                  <JsonEditor 
                    data={item} 
                    onChange={handleChange} 
                    path={`${path}[${index}]`} 
                    level={level + 1} 
                  />
                </AccordionItem>
              </li>
            );
          }


          return (
            <li key={index}>
              <JsonEditor data={item} onChange={handleChange} path={`${path}[${index}]`} level={level + 1} />
            </li>
          );
        })}
      </ul>
    );
  }

  // Объекты
  if (typeof data === 'object') {
    return (
      <div className={`space-y-4 ${level > 0 ? 'ml-4' : ''}`}>
        {Object.keys(data).map(
          (key) =>
            key !== 'type' && (
              <div key={key} className="bg-white p-2">
                <div className="flex items-center space-x-3 mb-2">
                  <label className="font-medium text-gray-700 text-sm uppercase tracking-wide">
                    {t(`loans.${key}`) || key}
                  </label>
                </div>
                <JsonEditor
                  data={data[key]}
                  onChange={(newValue) => onChange({ ...data, [key]: newValue })}
                  path={path ? `${path}.${key}` : key}
                  level={level + 1}
                />
              </div>
            )
        )}
      </div>
    );
  }

  return <div className="text-gray-600 bg-gray-50 px-3 py-2 rounded border">{data.toString()}</div>;
};

// Аккордеон для объектов внутри массивов
const AccordionItem: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-lg  shadow-sm">
      <button
        className="flex items-center justify-between w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100"
        onClick={() => setOpen(!open)}
      >
        <span>{label}</span>
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {open && <div className="p-3">{children}</div>}
    </div>
  );
};

// === LoanPage ===
const LoanPage: React.FC = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'ky';

  const [products, setProducts] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [loanData, setLoanData] = useState<any>(null);
  const [editedData, setEditedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await getLoanProductNames(lang);
        setProducts(data);
        if (data.length > 0) setSelectedType(data[0].type);
      } catch (err) {
        setError('Ошибка при загрузке продуктов');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, [lang]);

  useEffect(() => {
    if (!selectedType) return;
    const loadData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await getLoanProductByType(lang, selectedType);
        setLoanData(data);
        setEditedData(JSON.parse(JSON.stringify(data)));
        setSaveStatus('idle');
      } catch (err) {
        setError('Ошибка при загрузке данных продукта');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [selectedType, lang]);

  const handleSave = async () => {
    if (!editedData) return;
    setIsSaving(true);
    setSaveStatus('idle');
    setError('');
    try {
      const result = await updateLoanProduct(lang, selectedType, editedData);
      setLoanData(result);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      setSaveStatus('error');
      setError('Ошибка при сохранении данных');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PageHeader
          title={t('nav.loan_know')}
          description={t('dashboard.features.loanInfo.description')}
        />
        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Product Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex space-x-1 overflow-x-auto">
            {products.map((product) => (
              <button
                key={product.type}
                onClick={() => setSelectedType(product.type)}
                className={`relative px-6 py-3 font-medium text-sm rounded-t-lg transition-all duration-200 whitespace-nowrap
                  ${selectedType === product.type
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform -translate-y-px'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}
                `}
              >
                {product.name}
                {selectedType === product.type && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-6 h-6 text-blue-600 animate-spin" />
            <span className="ml-3 text-gray-600">Загрузка данных...</span>
          </div>
        ) : editedData ? (
          <div className="space-y-6">
            {/* Save Button */}
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  <span className="font-medium">{products.find(p => p.type === selectedType)?.name}</span>
                </span>
                {saveStatus === 'success' && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Сохранено успешно!</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg 
                  hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center space-x-2 transition-all duration-200 transform hover:scale-105"
              >
                {isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isSaving ? 'Сохранение...' : 'Сохранить'}</span>
              </button>
            </div>

            {/* Editor */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <JsonEditor data={editedData} onChange={setEditedData} />
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <Edit3 className="w-12 h-12 mx-auto mb-4" />
            <p>Выберите продукт для редактирования</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanPage;
