import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiClient, LoansResponse } from "@/lib/api";
import { Pagination } from "@/components/Pagination";

export default function Loans() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<LoansResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        if (id) {
          setLoading(true);
          const response = await apiClient.getCustomerLoans(
            Number(id),
            currentPage,
            pageSize
          );
          setData(response);
        }
      } catch (err) {
        setError("Failed to fetch loans");
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, [id, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'defaulted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLoanTypeIcon = (type: string) => {
    switch (type) {
      case 'personal':
        return '👤';
      case 'mortgage':
        return '🏠';
      case 'auto':
        return '🚗';
      case 'business':
        return '💼';
      default:
        return '💰';
    }
  };

  const getLoanTypeColor = (type: string) => {
    switch (type) {
      case 'personal':
        return 'text-blue-600 bg-blue-50';
      case 'mortgage':
        return 'text-green-600 bg-green-50';
      case 'auto':
        return 'text-purple-600 bg-purple-50';
      case 'business':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = Date.now();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading loans...</span>
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
        <h2 className="text-2xl font-bold text-gray-900">Loans</h2>
        {data && (
          <div className="text-sm text-gray-500">
            Showing {data.items.length} of {data.total} loans
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
                    Loan Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Principal Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest Rate
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Term
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.items.map((loan) => {
                  const progress = calculateProgress(loan.start_date, loan.end_date);
                  return (
                    <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm ${getLoanTypeColor(loan.loan_type)}`}>
                            {getLoanTypeIcon(loan.loan_type)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 capitalize">
                              {loan.loan_type.replace('_', ' ')} Loan
                            </div>
                           
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(Number(loan.principal_amount))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">
                          {loan.interest_rate}%
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900">
                            {new Date(loan.start_date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            to {new Date(loan.end_date).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(loan.status)}`}>
                          {loan.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Cards */}
          <div className="lg:hidden space-y-4">
            {data.items.map((loan) => {
              const progress = calculateProgress(loan.start_date, loan.end_date);
              return (
                <div key={loan.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getLoanTypeColor(loan.loan_type)}`}>
                        <span className="text-lg">{getLoanTypeIcon(loan.loan_type)}</span>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-900 capitalize">
                          {loan.loan_type.replace('_', ' ')} Loan
                        </div>
                        <div className="text-sm text-gray-500">ID: {loan.id}</div>
                      </div>
                    </div>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full capitalize ${getStatusColor(loan.status)}`}>
                      {loan.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Principal Amount</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {formatCurrency(Number(loan.principal_amount))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Interest Rate</div>
                      <div className="text-lg font-semibold text-gray-900">{loan.interest_rate}%</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-2">Loan Term</div>
                    <div className="text-sm text-gray-900">
                      {new Date(loan.start_date).toLocaleDateString()} - {new Date(loan.end_date).toLocaleDateString()}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Loans Found</h3>
          <p className="text-gray-500">This customer has no loan history.</p>
        </div>
      )}
    </div>
  );
}