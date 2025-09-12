import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { applicationsApiClient, CardApplication, CardApplicationsResponse } from '@/api/app';
import { Pagination } from '@/components/Pagination';
import { PageHeader } from "@/components/PageHeader";

export function CardApplicationsPage() {
  const { t } = useTranslation();
  const [cardApplications, setCardApplications] = useState<CardApplicationsResponse>({
    items: [],
    page: 1,
    page_size: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCardApplications = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await applicationsApiClient.getCardApplications(page, 10);
      setCardApplications(response);
    } catch (err) {
      setError(t('error.fetchingCardApplications'));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await applicationsApiClient.updateCardStatus(id, { status });
      await fetchCardApplications(cardApplications.page);
    } catch (err) {
      setError(t('error.updatingCardStatus'));
    }
  };

  useEffect(() => {
    fetchCardApplications(1);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCardTypeIcon = (cardType: string) => {
    switch (cardType.toLowerCase()) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      default:
        return '💳';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title={t('nav.cards')}
          description={t('dashboard.features.cardRequests.description')}
        />
        
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg">
            <div className="flex items-center">
              <div className="text-rose-400 mr-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
              <span className="text-gray-600">{t('loading')}</span>
            </div>
          </div>
        ) : (
          <>
            {/* Applications Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {cardApplications.items.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-6xl mb-4">📋</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Нет заявок
                  </h3>
                  <p className="text-gray-600">
                    Заявки на карты появятся здесь
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="">

                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="w-[10%]  text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Id
                        </th>
                        <th className="w-[10%] text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {t('cardApplications.customer')}
                        </th>
                        <th className="w-[20%] text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {t('cardApplications.cardType')}
                        </th>
                        <th className="w-[20%] text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {t('cardApplications.cardName')}
                        </th>
                        <th className="w-[20%] text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {t('cardApplications.status')}
                        </th>
                        <th className="w-[20%] text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {t('cardApplications.createdAt')}
                        </th>
                        <th className="w-[10%] text-right py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {t('cardApplications.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {cardApplications.items.map((app: CardApplication) => (
                        <tr key={app.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="!w-6 py-4 px-4">
                            <span className="text-sm font-medium text-gray-900">
                              #{app.id}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center min-w-0">
                              <span className="text-sm font-medium text-gray-900 truncate">
                                {app.customer_full_name}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <span className="mr-2 text-lg">
                                {getCardTypeIcon(app.card_type)}
                              </span>
                              <span className="text-sm text-gray-900 font-medium">
                                {app.card_type}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-gray-900 truncate block">
                              {app.card_name}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(app.status)}`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-gray-600">
                              {new Date(app.created_at).toLocaleDateString('ru-RU', {
                                year: '2-digit',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col items-center space-y-1.5">
                                <button
                                  onClick={() => handleStatusUpdate(app.id, 'approved')}
                                  className="w-full inline-flex items-center justify-center px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
                                >
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  Одобрить
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(app.id, 'rejected')}
                                  className="w-full inline-flex items-center justify-center px-2 py-1 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-md hover:bg-rose-100 hover:border-rose-300 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1"
                                >
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                  Отклонить
                                </button>
                            
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            {cardApplications.items.length > 0 && (
              <div className="mt-8">
                <Pagination
                  currentPage={cardApplications.page}
                  pageSize={cardApplications.page_size}
                  total={cardApplications.total}
                  onPageChange={fetchCardApplications}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}