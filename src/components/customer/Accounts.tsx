import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiClient, AccountsResponse } from "@/lib/api";
import { Pagination } from "@/components/Pagination";

export default function Accounts() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<AccountsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        if (id) {
          setLoading(true);
          const response = await apiClient.getCustomerAccounts(
            Number(id),
            currentPage,
            pageSize
          );
          setData(response);
        }
      } catch (err) {
        setError("Failed to fetch accounts");
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, [id, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'frozen':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'checking':
        return '🏦';
      case 'savings':
        return '💸';
      case 'investment':
        return '📈';
      default:
        return '💰';
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'checking':
        return 'text-blue-600 bg-blue-50';
      case 'savings':
        return 'text-green-600 bg-green-50';
      case 'investment':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading accounts...</span>
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
        <h2 className="text-2xl font-bold text-gray-900">Accounts</h2>
        {data && (
          <div className="text-sm text-gray-500">
            Showing {data.items.length} of {data.total} accounts
          </div>
        )}
      </div>

      {data && data.items.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Currency
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.items.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm ${getAccountTypeColor(account.account_type)}`}>
                          {getAccountTypeIcon(account.account_type)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 capitalize">
                            {account.account_type.replace('_', ' ')} Account
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-mono text-gray-900">
                        {account.account_number}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(account.balance, account.currency)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {account.currency}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(account.status)}`}>
                        {account.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(account.created_at).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Cards */}
          <div className="lg:hidden space-y-4">
            {data.items.map((account) => (
              <div key={account.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getAccountTypeColor(account.account_type)}`}>
                      <span className="text-lg">{getAccountTypeIcon(account.account_type)}</span>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900 capitalize">
                        {account.account_type.replace('_', ' ')} Account
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full capitalize ${getStatusColor(account.status)}`}>
                    {account.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Account Number</div>
                    <div className="text-sm font-mono text-gray-900">
                      {account.account_number}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Balance</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(account.balance, account.currency)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Currency</div>
                    <div className="text-sm text-gray-900">{account.currency}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Created</div>
                    <div className="text-sm text-gray-900">
                      {new Date(account.created_at).toLocaleDateString()}
                    </div>
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
            <span className="text-2xl">💰</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Accounts Found</h3>
          <p className="text-gray-500">This customer has no accounts.</p>
        </div>
      )}
    </div>
  );
}