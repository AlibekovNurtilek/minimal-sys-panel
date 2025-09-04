import React from 'react';
import { useTranslation } from 'react-i18next';
import { LoanApplication } from '@/api/app';
import { User, DollarSign, Calendar, FileText, Shield, Check, X, Building2 } from 'lucide-react';

interface LoanApplicationDetailsProps {
  selectedApplication: LoanApplication;
  onBack: () => void;
  onStatusUpdate: (id: number, status: 'approved' | 'rejected') => Promise<void>;
  formatCurrency: (amount: number) => string;
  getStatusBadge: (status: string) => JSX.Element;
}

const LoanApplicationDetails: React.FC<LoanApplicationDetailsProps> = ({
  selectedApplication,
  onBack,
  onStatusUpdate,
  formatCurrency,
  getStatusBadge,
}) => {
  const { t } = useTranslation();

  // Render dynamic loan_info fields
  const renderDynamicFields = (loanInfo: any, depth: number = 0): JSX.Element[] => {
    const renderValue = (key: string, value: any, currentDepth: number): JSX.Element => {
      const keyId = `${key}-${currentDepth}-${Math.random()}`;
      const indentClass = currentDepth > 0 ? `ml-${Math.min(currentDepth * 4, 12)}` : '';

      // Переводим ключ
      const translatedKey = t(`loans.${key}`);

      // Handle null or undefined
      if (value === null || value === undefined) {
        return (
          <div key={keyId} className={`py-2 ${indentClass}`}>
            <div className="flex items-start">
              <span className="w-1/2 text-gray-600 font-medium truncate">
                {translatedKey}:
              </span>
              <span className="w-1/2 text-gray-400 italic break-words">null</span>
            </div>
          </div>
        );
      }

      // Handle arrays
      if (Array.isArray(value)) {
        return (
          <div key={keyId} className={`py-2 ${indentClass}`}>
            <div className="text-gray-700 font-semibold mb-2">
              {translatedKey}:
            </div>
            <div className="bg-gray-50 rounded-lg p-3 ml-4">
              {value.length === 0 ? (
                <span className="text-gray-400 italic">Empty array</span>
              ) : (
                value.map((item, index) => (
                  <div key={`${keyId}-${index}`} className="mb-2 last:mb-0">
                    {typeof item === 'object' ? (
                      <div>
                        <div className="bg-white rounded p-2 ml-2">
                          {renderDynamicFields(item, currentDepth + 1)}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 flex-shrink-0"></span>
                        <span className="text-gray-800 break-words">{String(item)}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      }

      // Handle objects
      if (typeof value === 'object') {
        return (
          <div key={keyId} className={`py-2 ${indentClass}`}>
            <div className="text-gray-700 font-semibold mb-2">
              {translatedKey}:
            </div>
            <div className="bg-gray-50 rounded-lg p-3 ml-4">
              {Object.keys(value).length === 0 ? (
                <span className="text-gray-400 italic">Empty object</span>
              ) : (
                renderDynamicFields(value, currentDepth + 1)
              )}
            </div>
          </div>
        );
      }

      // Handle primitive values (string, number, boolean)
      return (
        <div key={keyId} className={`py-2 border-b border-gray-100 last:border-0 ${indentClass}`}>
          <div className="flex items-start">
            <span className="w-1/2 text-gray-600 font-medium truncate">
              {translatedKey}:
            </span>
            <span className="w-1/2 text-gray-900 font-semibold break-words">
              {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
            </span>
          </div>
        </div>
      );
    };

    if (!loanInfo || typeof loanInfo !== 'object') {
      return [
        <div key="no-data" className="py-4 text-center text-gray-400 italic">
          {t('loans_stats.no_additional_information_available')}
        </div>
      ];
    }

    return Object.keys(loanInfo).map(key => renderValue(key, loanInfo[key], depth));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('loans_stats.ai_bank')}</h1>
                <p className="text-sm text-gray-600">{t('loans_stats.administrative_panel')}</p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {t('loans_stats.back_to_applications')}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Application Review Header */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{t('loans_stats.loan_application_review')}</h2>
                <p className="text-sm text-gray-600">{t('loans_stats.application_id')}{selectedApplication.application.id}</p>
              </div>
              {getStatusBadge(selectedApplication.application.status)}
            </div>
          </div>

          {/* Customer Information */}
          <div className="p-6">
            <div className="flex items-center mb-4">
              <User className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">{t('loans_stats.customer_information')}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="w-1/2 text-gray-600 truncate">{t('loans_stats.full_name')}</span>
                  <span className="w-1/2 font-semibold break-words">{selectedApplication.customer.first_name} {selectedApplication.customer.middle_name} {selectedApplication.customer.last_name}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1/2 text-gray-600 truncate">{t('loans_stats.birth_date')}</span>
                  <span className="w-1/2 font-semibold break-words">{selectedApplication.customer.birth_date}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1/2 text-gray-600 truncate">{t('loans_stats.passport')}</span>
                  <span className="w-1/2 font-semibold break-words">{selectedApplication.customer.passport_number}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1/2 text-gray-600 truncate">{t('loans_stats.phone')}</span>
                  <span className="w-1/2 font-semibold break-words">{selectedApplication.customer.phone_number}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="w-1/2 text-gray-600 truncate">{t('loans_stats.email')}</span>
                  <span className="w-1/2 font-semibold break-words">{selectedApplication.customer.email}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1/2 text-gray-600 truncate">{t('loans_stats.address')}</span>
                  <span className="w-1/2 font-semibold break-words">{selectedApplication.customer.address}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1/2 text-gray-600 truncate">{t('loans_stats.customer_since')}</span>
                  <span className="w-1/2 font-semibold break-words">{new Date(selectedApplication.customer.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Loan Details */}
            <div className="flex items-center mb-4">
              <DollarSign className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">{t('loans_stats.loan_details')}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="w-1/2 text-gray-600 truncate">{t('loans_stats.loan_type')}</span>
                  <span className="w-1/2 font-semibold break-words">{selectedApplication.application.loan_type}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1/2 text-gray-600 truncate">{t('loans_stats.amount')}</span>
                  <span className="w-1/2 font-semibold text-green-600 break-words">{formatCurrency(selectedApplication.application.amount)}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1/2 text-gray-600 truncate">{t('loans_stats.term')}</span>
                  <span className="w-1/2 font-semibold break-words">{selectedApplication.application.term_months} {t('loans_stats.months')}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="w-1/2 text-gray-600 truncate">{t('loans_stats.interest_rate')}</span>
                  <span className="w-1/2 font-semibold break-words">{selectedApplication.application.interest_rate}%</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1/2 text-gray-600 truncate">{t('loans_stats.own_contribution')}</span>
                  <span className="w-1/2 font-semibold break-words">{formatCurrency(selectedApplication.application.own_contribution)}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-1/2 text-gray-600 truncate">{t('loans_stats.collateral')}</span>
                  <span className="w-1/2 font-semibold break-words">{selectedApplication.application.collateral}</span>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="flex items-center mb-4">
              <FileText className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">{t('loans_stats.additional_information')}</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              {renderDynamicFields(selectedApplication.loan_info)}
            </div>

            {/* Application Timeline */}
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 text-orange-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">{t('loans_stats.application_timeline')}</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-start">
                <span className="w-1/2 text-gray-600 truncate">{t('loans_stats.submitted')}</span>
                <span className="w-1/2 font-semibold break-words">{new Date(selectedApplication.application.created_at).toLocaleString()}</span>
              </div>
              <div className="flex items-start">
                <span className="w-1/2 text-gray-600 truncate">{t('loans_stats.last_updated')}</span>
                <span className="w-1/2 font-semibold break-words">{new Date(selectedApplication.application.updated_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decision Actions */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">{t('loans_stats.decision_required')}</h3>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-6">{t('loans_stats.review_application_prompt')}</p>
            <div className="flex space-x-4">
              <button
                onClick={() => onStatusUpdate(selectedApplication.application.id, 'approved')}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                <Check className="w-5 h-5 mr-2" />
                {t('loans_stats.approve_application')}
              </button>
              <button
                onClick={() => onStatusUpdate(selectedApplication.application.id, 'rejected')}
                className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                <X className="w-5 h-5 mr-2" />
                {t('loans_stats.reject_application')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationDetails;