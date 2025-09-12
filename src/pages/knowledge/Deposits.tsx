// Deposits.tsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient, DepositsResponse } from "@/lib/api";
import { Banknote, ExternalLink } from "lucide-react";
import DepositDetails from "@/components/DepositDetails";
import { PageHeader } from "@/components/PageHeader";
import {t} from "i18next";

export default function Deposits() {
  const { t, i18n } = useTranslation();
  const [deposits, setDeposits] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDeposit, setSelectedDeposit] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        setLoading(true);
        const response: DepositsResponse = await apiClient.getDeposits(i18n.language);
        setDeposits(response.deposits);
      } catch (err) {
        setError("Ошибка при загрузке депозитов");
      } finally {
        setLoading(false);
      }
    };

    fetchDeposits();
  }, [i18n.language]);

  const handleDepositClick = (depositKey: string) => {
    setSelectedDeposit(depositKey);
  };

  const handleBackClick = () => {
    setSelectedDeposit(null);
  };

  if (selectedDeposit) {
    return <DepositDetails depositKey={selectedDeposit} onBack={handleBackClick} />;
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto p-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-blue-600">
            {t("nav.deposits")}
          </h1>
          <p className="text-muted-foreground text-lg">
            Информация о депозитах и финансовых продуктах
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
            </div>
            <p className="text-center mt-4 text-muted-foreground">
              Загрузка депозитов...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <PageHeader
          title={t('nav.deposits')}
          description={t('dashboard.features.depositInfo.description')}
        />
      <Card className="shadow-md border border-gray-200 bg-white">
        <CardHeader className="border-b bg-blue-50">
          <CardTitle className="flex items-center space-x-2 text-xl">
            <Banknote className="h-6 w-6 text-blue-600" />
            <span>Доступные депозиты</span>
            {deposits && (
              <span className="ml-auto text-sm font-normal text-blue-600 px-3 py-1 rounded-full border border-blue-200">
                {Object.keys(deposits).length} продуктов
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {error && (
            <div className="p-6 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {!error && !deposits && (
            <div className="p-8 text-center">
              <Banknote className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">Депозиты не найдены</p>
            </div>
          )}

          {!error && deposits && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(deposits).map(([key, name], index) => (
                <div
                  key={key}
                  onClick={() => handleDepositClick(key)}
                  className="group cursor-pointer p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Banknote className="h-6 w-6 text-blue-600 group-hover:text-blue-700 transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                          {name}
                        </h3>
                        <p className="text-sm text-gray-500">Подробнее</p>
                      </div>
                    </div>
                    <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
