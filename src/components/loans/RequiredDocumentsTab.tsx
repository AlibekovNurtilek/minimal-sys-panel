import React, { useEffect, useState } from "react";
import { RequiredDocuments } from "@/types/knowledge";
import { updateRequiredDocuments } from "@/api/knowledge";

interface Props {
  data: RequiredDocuments;
  lang?: string;
  onUpdate?: (updated: RequiredDocuments) => void; // чтобы обновлять родителя
}

const RequiredDocumentsTab: React.FC<Props> = ({ data: initialData, lang = "ru", onUpdate }) => {
  const [data, setData] = useState<RequiredDocuments>(initialData);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Изменяем документ заёмщика / поручителя
  const handleBorrowerChange = (idx: number, value: string) => {
    const newList = [...data.borrower_guarantor];
    newList[idx] = value;
    setData({ ...data, borrower_guarantor: newList });
  };

  // Изменяем движимое имущество
  const handleMovableChange = (idx: number, value: string) => {
    const newList = [...data.collateral.movable_property];
    newList[idx] = value;
    setData({
      ...data,
      collateral: { ...data.collateral, movable_property: newList },
    });
  };

  // Изменяем недвижимость
  const handleRealEstateChange = (idx: number, value: string) => {
    const newList = [...data.collateral.real_estate];
    newList[idx] = value;
    setData({
      ...data,
      collateral: { ...data.collateral, real_estate: newList },
    });
  };

  // Изменяем заметку
  const handleNoteChange = (value: string) => {
    setData({ ...data, note: value });
  };

  // Сохраняем изменения на сервер
  const handleSave = async () => {
    setSaving(true);
    try {
      await updateRequiredDocuments(lang, data);
      if (onUpdate) onUpdate(data); // обновляем родителя сразу
      setEditing(false);
      alert("Данные успешно обновлены!");
    } catch (err) {
      console.error(err);
      alert("Ошибка при сохранении");
    } finally {
      setSaving(false);
    }
  };

useEffect(() => {
  setData(initialData);
}, [initialData]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Необходимые документы</h2>
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => {
            if (editing) {
              setData(initialData); // отменяем изменения
              setEditing(false);
            } else {
              setEditing(true);
            }
          }}
        >
          {editing ? "Отменить" : "Редактировать"}
        </button>
      </div>

      {/* Документы заёмщика / поручителя */}
      <div>
        <h3 className="font-semibold mb-2">Документы заёмщика / поручителя</h3>
        <ul className="list-disc pl-5 space-y-1">
          {data.borrower_guarantor.map((doc, idx) => (
            <li key={idx}>
              {editing ? (
                <input
                  type="text"
                  value={doc}
                  onChange={(e) => handleBorrowerChange(idx, e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              ) : (
                doc
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Залоговое имущество */}
      <div>
        <h3 className="font-semibold mb-1">Залоговое имущество</h3>

        <div className="pl-5 space-y-2">
          <h4 className="font-semibold">Движимое имущество:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {data.collateral.movable_property.map((doc, idx) => (
              <li key={idx}>
                {editing ? (
                  <input
                    type="text"
                    value={doc}
                    onChange={(e) => handleMovableChange(idx, e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  doc
                )}
              </li>
            ))}
          </ul>

          <h4 className="font-semibold mt-2">Недвижимость:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {data.collateral.real_estate.map((doc, idx) => (
              <li key={idx}>
                {editing ? (
                  <input
                    type="text"
                    value={doc}
                    onChange={(e) => handleRealEstateChange(idx, e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  doc
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Примечание */}
      <div>
        <label className="font-semibold">Примечание:</label>
        {editing ? (
          <input
            type="text"
            value={data.note}
            onChange={(e) => handleNoteChange(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        ) : (
          <p className="text-gray-600">{data.note}</p>
        )}
      </div>

      {/* Кнопка сохранения */}
      {editing && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {saving ? "Сохраняем..." : "Сохранить изменения"}
        </button>
      )}
    </div>
  );
};

export default RequiredDocumentsTab;
