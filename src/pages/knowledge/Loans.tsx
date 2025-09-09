import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getLoanProductNames, getLoanProductByType, updateLoanProduct } from '@/api/knowledge'; // Assuming the API functions are in api.ts

type JsonEditorProps = {
  data: any;
  onChange: (newData: any) => void;
  path?: string;
};

const JsonEditor: React.FC<JsonEditorProps> = ({ data, onChange, path = '' }) => {
  const { t } = useTranslation();
  if (data === null || data === undefined) {
    return <div>null</div>;
  }

  if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
    return (
      <input
        type={typeof data === 'number' ? 'number' : typeof data === 'boolean' ? 'checkbox' : 'text'}
        value={typeof data === 'boolean' ? undefined : data}
        checked={typeof data === 'boolean' ? data : undefined}
        onChange={(e) => {
          let newValue;
          if (typeof data === 'number') {
            newValue = parseFloat(e.target.value) || 0;
          } else if (typeof data === 'boolean') {
            newValue = e.target.checked;
          } else {
            newValue = e.target.value;
          }
          onChange(newValue);
        }}
      />
    );
  }

  if (Array.isArray(data)) {
    return (
      <div style={{ marginLeft: '20px' }}>
        {data.map((item, index) => (
          <div key={index}>
            <JsonEditor
              data={item}
              onChange={(newItem) => {
                const newArray = [...data];
                newArray[index] = newItem;
                onChange(newArray);
              }}
              path={`${path}[${index}]`}
            />
          </div>
        ))}
      </div>
    );
  }

  if (typeof data === 'object') {
    return (
      <div style={{ marginLeft: '20px' }}>
        {Object.keys(data).map((key) => (
          <div key={key}>
            <label>{t(`loans.${key}`)}:</label>
            <JsonEditor
              data={data[key]}
              onChange={(newValue) => {
                onChange({ ...data, [key]: newValue });
              }}
              path={path ? `${path}.${key}` : key}
            />
          </div>
        ))}
      </div>
    );
  }

  return <div>{data.toString()}</div>;
};

const LoanPage: React.FC = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'ky';

  const [products, setProducts] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [loanData, setLoanData] = useState<any>(null);
  const [editedData, setEditedData] = useState<any>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getLoanProductNames(lang);
        setProducts(data);
        if (data.length > 0) {
          setSelectedType(data[0].type);
        }
      } catch (err) {
        console.error('Error loading loan products:', err);
      }
    };
    loadProducts();
  }, [lang]);

  useEffect(() => {
    if (selectedType) {
      const loadData = async () => {
        try {
          const data = await getLoanProductByType(lang, selectedType);
          setLoanData(data);
          setEditedData(JSON.parse(JSON.stringify(data))); // Deep copy for editing
        } catch (err) {
          console.error('Error loading loan product:', err);
        }
      };
      loadData();
    }
  }, [selectedType, lang]);

  const handleSave = async () => {
    if (!editedData) return;
    try {
      const result = await updateLoanProduct(lang, selectedType, editedData);
      setLoanData(result);
      alert('Изменения сохранены успешно!');
    } catch (err) {
      console.error('Error saving loan product:', err);
      alert('Ошибка при сохранении!');
    }
  };

  return (
    <div>
      <h1>Добро пожаловать в Ai Bank!</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {products.map((product) => (
          <button
            key={product.type}
            onClick={() => setSelectedType(product.type)}
            style={{
              fontWeight: selectedType === product.type ? 'bold' : 'normal',
              padding: '10px',
              backgroundColor: selectedType === product.type ? '#ddd' : 'transparent',
            }}
          >
            {product.name}
          </button>
        ))}
      </div>
      {editedData && (
        <div>
          <JsonEditor data={editedData} onChange={setEditedData} />
          <button onClick={handleSave} style={{ marginTop: '20px', padding: '10px' }}>
            Сохранить
          </button>
        </div>
      )}
    </div>
  );
};

export default LoanPage;