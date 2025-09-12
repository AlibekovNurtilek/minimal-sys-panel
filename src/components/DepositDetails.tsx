import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent} from "@/components/ui/card";
import { apiClient,DepositResponse } from "@/lib/api";
import { Banknote, TrendingUp, Shield, Clock, ArrowLeft, ExternalLink} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function DepositDetails({ 
  depositKey, 
  onBack 
}: { 
  depositKey: string; 
  onBack: () => void; 
}) {
  const { t, i18n } = useTranslation();
  const [depositDetails, setDepositDetails] = useState<DepositResponse | null>(null);
  const [editedData, setEditedData] = useState<DepositResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchDepositDetails = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getDepositDetails(depositKey, i18n.language);
        setDepositDetails(response);
        setEditedData(response);
      } catch (err) {
        setError(t("common.error"));
      } finally {
        setLoading(false);
      }
    };

    fetchDepositDetails();
  }, [depositKey, i18n.language]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (key: string, value: any) => {
    if (editedData && depositKey in editedData) {
      setEditedData({
        ...editedData,
        [depositKey]: {
          ...editedData[depositKey],
          [key]: value,
        },
      });
    }
  };

  const handleSave = async () => {
    if (!editedData || !depositKey) return;

    try {
      setLoading(true);
      await apiClient.updateDepositDetails(
        depositKey,
        editedData[depositKey],
        i18n.language
      );
      
      // После успешного сохранения повторно получаем данные
      const refreshedData = await apiClient.getDepositDetails(depositKey, i18n.language);
      setDepositDetails(refreshedData);
      setEditedData(refreshedData);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const renderField = (key: string, value: any) => {
    if (value === null || value === undefined) return null;

    const getFieldIcon = (fieldKey: string) => {
      const iconMap: Record<string, React.ReactNode> = {
        currency: <Banknote className="h-4 w-4" />,
        yield_mechanism: <TrendingUp className="h-4 w-4" />,
        guarantee: <Shield className="h-4 w-4" />,
        term: <Clock className="h-4 w-4" />,
      };
      return iconMap[fieldKey] || <ExternalLink className="h-4 w-4" />;
    };

    const formatFieldName = (fieldKey: string) => {
      const translatedName = t(`deposits.${fieldKey}`);
      return translatedName !== `deposits.${fieldKey}` 
        ? translatedName 
        : fieldKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    if (Array.isArray(value)) {
      return (
        <div key={key} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-2 mb-2">
            {getFieldIcon(key)}
            <h3 className="font-semibold text-gray-800">{formatFieldName(key)}</h3>
          </div>
          {isEditing ? (
            <Input
              value={editedData?.[depositKey]?.[key]?.join(", ") || ""}
              onChange={(e) => handleInputChange(key, e.target.value.split(", "))}
              className="w-full"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {value.map((item, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (typeof value === 'string') {
      const isDescription = key === 'descr';
      return (
        <div key={key} className={`bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow ${isDescription ? 'col-span-2' : ''}`}>
          <div className="flex items-center space-x-2 mb-2">
            {getFieldIcon(key)}
            <h3 className="font-semibold text-gray-800">{formatFieldName(key)}</h3>
          </div>
          {isEditing ? (
            isDescription ? (
              <Textarea
                value={editedData?.[depositKey]?.[key] || ""}
                onChange={(e) => handleInputChange(key, e.target.value)}
                className="w-full"
              />
            ) : (
              <Input
                value={editedData?.[depositKey]?.[key] || ""}
                onChange={(e) => handleInputChange(key, e.target.value)}
                className="w-full"
              />
            )
          ) : (
            <p className={`text-gray-600 ${isDescription ? 'text-base leading-relaxed' : ''}`}>
              {value}
            </p>
          )}
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t("common.loading")}
          </h1>
        </div>
        
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold text-red-600">{t("common.error")}</h1>
        </div>
        
        <Card>
          <CardContent className="p-8">
            <p className="text-red-600 text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const depositData = depositDetails ? Object.values(depositDetails)[0] : null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {depositData?.name || depositKey}
            </h1>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={handleEditToggle}
          >
            {isEditing ? t("common.cancel") : t("common.edit")}
          </Button>
          {isEditing && (
            <Button onClick={handleSave} disabled={loading}>
              {t("common.save")}
            </Button>
          )}
        </div>
      </div>

      {depositData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(depositData).map(([key, value]) => renderField(key, value))}
        </div>
      )}
    </div>
  );
}