import React, { useState } from "react";
import { LoanApplicationProcess } from "@/types/knowledge";
import { updateLoanApplicationProcess } from "@/api/knowledge";

interface Props {
  initialData: LoanApplicationProcess;
  lang?: string;
  onUpdate?: (updated: LoanApplicationProcess) => void;
}

const LoanApplicationProcessTab: React.FC<Props> = ({ initialData, lang = "ru", onUpdate }) => {
  const [data, setData] = useState<LoanApplicationProcess>(initialData);
  const [editing, setEditing] = useState(false); 
  const [saving, setSaving] = useState(false);

  const handleStepChange = (idx: number, value: string) => {
    const newSteps = [...data.steps];
    newSteps[idx] = value;
    setData({ ...data, steps: newSteps });
  };

  const handleReviewTimeChange = (value: string) => {
    setData({ ...data, review_time: value });
  };
const handleSave = async () => {
  setSaving(true);
  try {
    await updateLoanApplicationProcess(lang, data);
    setEditing(false); 
    alert("Данные успешно обновлены!");
    if (onUpdate) onUpdate(data);
  } catch (err) {
    console.error("Ошибка при обновлении:", err);
    alert("Произошла ошибка при сохранении");
  } finally {
    setSaving(false);
  }
};


  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Порядок подачи заявки</h2>
       <button
        onClick={() => {
          if (editing) {
            setData(initialData);
            setEditing(false);
          } else {
            setEditing(true);
          }
        }}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
>
  {editing ? "Отменить" : "Редактировать"}
</button>

      </div>

      <div className="flex flex-col  items-start gap-5">
        {data.steps.map((step, idx) => (
          <div key={idx} className="flex items-center md:flex-1 mb-2 md:mb-0">
            <div className="flex flex-col items-center">
              <span className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white font-bold rounded-full">
                {idx + 1}
              </span>
            
            </div>
            {editing ? (
              <input
                type="text"
                value={step}
                onChange={(e) => handleStepChange(idx, e.target.value)}
                className="border rounded px-2 py-1 flex-1 ml-4"
              />
            ) : (
              <span className="ml-4">{step}</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <span className="font-semibold">Срок рассмотрения:</span>
        {editing ? (
          <input
            type="text"
            value={data.review_time}
            onChange={(e) => handleReviewTimeChange(e.target.value)}
            className="border rounded px-2 py-1"
          />
        ) : (
          <span>{data.review_time}</span>
        )}
      </div>

      {editing && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="self-start px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {saving ? "Сохраняем..." : "Сохранить изменения"}
        </button>
      )}
    </div>
  );
};

export default LoanApplicationProcessTab;
