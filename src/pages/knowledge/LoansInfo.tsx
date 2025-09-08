import React, { useEffect, useState } from "react";
import { 
  getLoanApplicationProcess, 
  getRequiredDocuments, 
  getLoanProducts 
} from "@/api/knowledge";
import { LoanApplicationProcess, RequiredDocuments, LoanProduct } from "@/types/knowledge";
import LoanApplicationProcessTab from "@/components/loans/LoanApplicationProcessTab";
import RequiredDocumentsTab from "@/components/loans/RequiredDocumentsTab";
import LoanProductsTab from "@/components/loans/LoanProductsTab";

type Tab = "application" | "documents" | "products";

const LoansInfo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("application");
  const [applicationProcess, setApplicationProcess] = useState<LoanApplicationProcess | null>(null);
  const [requiredDocuments, setRequiredDocuments] = useState<RequiredDocuments | null>(null);
  const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [app, docs, products] = await Promise.all([
          getLoanApplicationProcess("ru"),
          getRequiredDocuments("ru"),
          getLoanProducts("ru")
        ]);

        setApplicationProcess(app);
        setRequiredDocuments(docs);
        setLoanProducts(products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-4">Загрузка...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Кредиты</h1>

      {/* Таб меню */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 ${activeTab === "application" ? "border-b-2 border-blue-500 font-semibold" : ""}`}
          onClick={() => setActiveTab("application")}
        >
          Порядок подачи
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "documents" ? "border-b-2 border-blue-500 font-semibold" : ""}`}
          onClick={() => setActiveTab("documents")}
        >
          Необходимые документы
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "products" ? "border-b-2 border-blue-500 font-semibold" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Продукты
        </button>
      </div>

      {/* Контент вкладок */}
      <div>
        {activeTab === "application" && applicationProcess && (
          <LoanApplicationProcessTab
            initialData={applicationProcess}
            onUpdate={(updated) => setApplicationProcess(updated)}
/>
        )}
        {activeTab === "documents" && requiredDocuments && (
          <RequiredDocumentsTab data={requiredDocuments} />
        )}
        {activeTab === "products" && <LoanProductsTab data={loanProducts} />}
      </div>
    </div>
  );
};

export default LoansInfo;