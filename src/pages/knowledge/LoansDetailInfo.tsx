import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSpecialOffers, getSpecialPrograms, getSubcategories } from "@/api/knowledge";
import { Subcategory, SpecialProgram, SpecialOffer } from "@/types/knowledge";
import { Layers, Gift, FileText } from "lucide-react";

const LoanDetailPage: React.FC = () => {
  const { loan_type } = useParams();
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [specialPrograms, setSpecialPrograms] = useState<SpecialProgram[]>([]);
  const [specialOffers, setSpecialOffers] = useState<Record<string, SpecialOffer[]>>({});

  useEffect(() => {
    if (!loan_type) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [subs, programs, offers] = await Promise.all([
          getSubcategories(loan_type, "ru"),
          getSpecialPrograms(loan_type, "ru"),
          getSpecialOffers(loan_type, "ru"),
        ]);
        setSubcategories(subs);
        setSpecialPrograms(programs);
        setSpecialOffers(offers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loan_type]);

  const renderDynamicFields = (data: any, depth: number = 0): JSX.Element[] => {
    const indent = depth * 4;

    if (data === null || data === undefined) {
      return [<p key={Math.random()} className="italic text-gray-400">null</p>];
    }

    if (Array.isArray(data)) {
      if (data.length === 0) return [<p key={Math.random()} className="italic text-gray-400">Empty array</p>];
      return data.map((item, idx) => (
        <div key={idx} className="mb-2">
          {typeof item === "object" ? (
            <div className="bg-gray-50 p-2 rounded">{renderDynamicFields(item, depth + 1)}</div>
          ) : (
            <p className="break-words">{String(item)}</p>
          )}
        </div>
      ));
    }

    if (typeof data === "object") {
      if (Object.keys(data).length === 0) return [<p key={Math.random()} className="italic text-gray-400">Empty object</p>];
      return Object.entries(data).map(([key, value]) => (
        <div key={key} className="mb-2" style={{ marginLeft: indent }}>
          <strong className="text-gray-700">{key}:</strong>
          {typeof value === "object" ? renderDynamicFields(value, depth + 1) : <span className="ml-2 text-gray-900">{String(value)}</span>}
        </div>
      ));
    }

    return [<span key={Math.random()}>{String(data)}</span>];
  };

  if (loading) return <p className="p-6 text-center text-lg">Загрузка...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold capitalize">{loan_type}</h1>

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" /> Подкатегории
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subcategories.map((sub, idx) => (
              <div key={idx} className="bg-white border rounded-xl p-5 shadow-md hover:shadow-lg transition">
                {renderDynamicFields(sub)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Special Programs */}
      {specialPrograms.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-600" /> Специальные программы
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialPrograms.map((sp, idx) => (
              <div key={idx} className="bg-white border rounded-xl p-5 shadow-md hover:shadow-lg transition">
                {renderDynamicFields(sp)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Special Offers */}
      {Object.keys(specialOffers).length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-purple-600" /> Специальные предложения
          </h2>
          {Object.entries(specialOffers).map(([city, offers]) => (
            <div key={city} className="mb-6">
              <h3 className="text-xl font-semibold mb-3">{city}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.map((offer, idx) => (
                  <div key={idx} className="bg-white border rounded-xl p-5 shadow-md hover:shadow-lg transition">
                    {renderDynamicFields(offer)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {subcategories.length === 0 && specialPrograms.length === 0 && Object.keys(specialOffers).length === 0 && (
        <p className="text-center text-gray-500 text-lg">Нет данных для отображения.</p>
      )}
    </div>
  );
};

export default LoanDetailPage;
  