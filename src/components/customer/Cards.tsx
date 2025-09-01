import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiClient, CardsResponse } from "@/lib/api";
import { Pagination } from "@/components/Pagination";

export default function Cards() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<CardsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  useEffect(() => {
    const fetchCards = async () => {
      try {
        if (id) {
          setLoading(true);
          const response = await apiClient.getCustomerCards(
            Number(id),
            currentPage,
            pageSize
          );
          setData(response);
        }
      } catch (err) {
        setError("Failed to fetch cards");
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, [id, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCardTypeColor = (type: string) => {
    switch (type) {
      case 'debit':
        return 'bg-blue-600';
      case 'credit':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  const maskCardNumber = (cardNumber: string) => {
    if (cardNumber.length < 4) return cardNumber;
    return '**** **** **** ' + cardNumber.slice(-4);
  };

  const isExpiringSoon = (expirationDate: string) => {
    const expiry = new Date(expirationDate);
    const now = new Date();
    const threeMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
    return expiry <= threeMonthsFromNow && expiry >= now;
  };

  const isExpired = (expirationDate: string) => {
    return new Date(expirationDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading cards...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="w-5 h-5 bg-red-500 rounded-full mr-3"></div>
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Cards</h2>
        {data && (
          <div className="text-sm text-gray-500">
            Showing {data.items.length} of {data.total} cards
          </div>
        )}
      </div>

      {data && data.items.length > 0 ? (
        <>
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {data.items.map((card) => {
              const expiringSoon = isExpiringSoon(card.expiration_date);
              const expired = isExpired(card.expiration_date);
              
              return (
                <div key={card.id} className="relative">
                  {/* Card Visual */}
                  <div className={`
                    relative w-full h-56 rounded-xl p-6 text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl
                    ${getCardTypeColor(card.card_type)}
                    ${card.status !== 'active' ? 'opacity-75 grayscale' : ''}
                  `}>
                    {/* Card Type Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                        {card.card_type}
                      </span>
                    </div>

                    {/* Card Number */}
                    <div className="mt-8">
                      <div className="text-lg font-mono tracking-wider">
                        {maskCardNumber(card.card_number)}
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs opacity-75 mb-1">Expires</div>
                          <div className="font-semibold">
                            {new Date(card.expiration_date).toLocaleDateString('en-US', { 
                              month: '2-digit', 
                              year: '2-digit' 
                            })}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs opacity-75 mb-1">ID</div>
                          <div className="font-semibold">#{card.id}</div>
                        </div>
                      </div>
                    </div>

                    {/* Chip Visual */}
                    <div className="absolute top-16 left-6 w-12 h-8 bg-yellow-400 rounded-md opacity-80"></div>
                  </div>

                  {/* Card Info Below */}
                  <div className="mt-4 space-y-3">
                    {/* Status */}
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full capitalize ${getStatusColor(card.status)}`}>
                        {card.status}
                      </span>
                      {expired && (
                        <span className="text-red-500 text-sm font-medium">Expired</span>
                      )}
                      {expiringSoon && !expired && (
                        <span className="text-orange-500 text-sm font-medium">Expires Soon</span>
                      )}
                    </div>

                    {/* Created Date */}
                    <div className="text-sm text-gray-500">
                      <span>Issued: </span>
                      <span>{new Date(card.created_at).toLocaleDateString()}</span>
                    </div>

                    {/* Warnings */}
                    {(expired || expiringSoon) && (
                      <div className={`p-3 rounded-lg text-sm ${
                        expired 
                          ? 'bg-red-50 text-red-700 border border-red-200' 
                          : 'bg-orange-50 text-orange-700 border border-orange-200'
                      }`}>
                        {expired 
                          ? 'This card has expired and needs to be replaced.' 
                          : 'This card expires within 3 months. Consider renewal.'
                        }
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Table View (Alternative) */}
          <div className="lg:hidden mt-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900">Card Details</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {data.items.map((card) => (
                  <div key={card.id} className="px-4 py-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-5 rounded ${getCardTypeColor(card.card_type)}`}></div>
                        <div>
                          <div className="font-medium text-gray-900 capitalize">{card.card_type}</div>
                          <div className="text-sm text-gray-500 font-mono">
                            {maskCardNumber(card.card_number)}
                          </div>
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(card.status)}`}>
                        {card.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Expires:</span>
                        <span className="ml-2 text-gray-900">
                          {new Date(card.expiration_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Issued:</span>
                        <span className="ml-2 text-gray-900">
                          {new Date(card.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              total={data.total}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <div className="w-10 h-6 bg-gray-400 rounded"></div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Cards Found</h3>
          <p className="text-gray-500">This customer has no cards issued.</p>
        </div>
      )}
    </div>
  );
}