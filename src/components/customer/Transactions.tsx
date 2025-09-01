import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiClient, TransactionsResponse } from "@/lib/api";
import { Pagination } from "@/components/Pagination";

export default function Transactions() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<TransactionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (id) {
          setLoading(true);
          const response = await apiClient.getCustomerTransactions(
            Number(id),
            currentPage,
            pageSize
          );
          setData(response);
        }
      } catch (err) {
        setError("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [id, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'text-green-600';
      case 'withdrawal':
        return 'text-red-600';
      case 'transfer':
        return 'text-blue-600';
      case 'payment':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading transactions...</span>
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
        <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
        {data && (
          <div className="text-sm text-gray-500">
            Showing {data.items.length} of {data.total} transactions
          </div>
        )}
      </div>

      {data && data.items.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accounts
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.items.map((transaction, index) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">
                          From: {transaction.from_account_id || 'External'}
                        </div>
                        <div className="text-sm text-gray-500">
                          To: {transaction.to_account_id || 'External'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium capitalize ${getTypeColor(transaction.transaction_type)}`}>
                        {transaction.transaction_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatAmount(Number(transaction.amount), transaction.currency)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {transaction.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(transaction.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {data.items.map((transaction) => (
              <div key={transaction.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className={`text-sm font-medium capitalize ${getTypeColor(transaction.transaction_type)}`}>
                      {transaction.transaction_type}
                    </span>
                    <div className="text-lg font-semibold text-gray-900 mt-1">
                      {formatAmount(Number(transaction.amount), transaction.currency)}
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">From:</span>
                    <span className="ml-2 text-gray-900">{transaction.from_account_id || 'External'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">To:</span>
                    <span className="ml-2 text-gray-900">{transaction.to_account_id || 'External'}</span>
                  </div>
                  {transaction.description && (
                    <div>
                      <span className="text-gray-500">Description:</span>
                      <span className="ml-2 text-gray-900">{transaction.description}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-gray-500 text-xs">
                      {new Date(transaction.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
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
            <div className="w-8 h-8 bg-gray-400 rounded"></div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Found</h3>
          <p className="text-gray-500">This customer has no transaction history yet.</p>
        </div>
      )}
    </div>
  );
}