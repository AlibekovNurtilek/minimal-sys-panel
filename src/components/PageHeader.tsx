// src/components/PageHeader.tsx
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {t} from "i18next";

interface PageHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function PageHeader({ title, description, showBackButton = true, onBack }: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {description && <p className="text-gray-500 mt-1">{description}</p>}
      </div>

      {showBackButton && (
        <button
          onClick={handleBack}
          className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.back')}
        </button>
      )}
    </div>
  );
}
