import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { loanApplicationsApiClient, LoanApplication, UpdateLoanStatusData } from '@/api/app';
import { Pagination } from '@/components/Pagination';
import { Building2, Eye } from 'lucide-react';
import LoanApplicationDetails from '@/components/LoanDetails';

interface DynamicField {
  key: string;
  value: any;
}

const LoanApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const [total, setTotal] = useState<number>(0);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const { t } = useTranslation();
  // Fetch loan applications based on currentPage and pageSize
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await loanApplicationsApiClient.getLoanApplications(currentPage, pageSize);
        setApplications(response.items);
        setTotal(response.total);
      } catch (err) {
        setError('Failed to load loan applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [currentPage, pageSize]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Handle status update (Approve/Reject)
  const handleStatusUpdate = async (id: number, status: 'approved' | 'rejected') => {
    try {
      const data: UpdateLoanStatusData = { status };
      await loanApplicationsApiClient.updateLoanStatus(id, data);
      // Update local state to reflect the change
      setApplications(applications.map(app => 
        app.application.id === id ? { ...app, application: { ...app.application, status } } : app
      ));
      if (selectedApplication?.application.id === id) {
        setSelectedApplication({ ...selectedApplication, application: { ...selectedApplication.application, status } });
      }
    } catch (err) {
      setError(`Failed to update application ${id}`);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('kg-KG', { style: 'currency', currency: 'KGS' }).format(amount);
  };

  // Status badge
  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  if (showDetails && selectedApplication) {
    return (
      <LoanApplicationDetails
        selectedApplication={selectedApplication}
        onBack={() => setShowDetails(false)}
        onStatusUpdate={handleStatusUpdate}
        formatCurrency={formatCurrency}
        getStatusBadge={getStatusBadge}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Building2 className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Bank</h1>
              <p className="text-sm text-gray-600">Administrative Panel - Loan Applications</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Loan Applications</h2>
              <p className="text-sm text-gray-600">Manage and review loan applications</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Type</th>
                    <th className="LoanApplicationsPage.tsxpx-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map(({ application, customer }) => (
                    <tr key={application.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{application.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {customer.first_name} {customer.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application.loan_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        {formatCurrency(application.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application.term_months} {t('m')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application.interest_rate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(application.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(application.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedApplication(applications.find(app => app.application.id === application.id) || null);
                            setShowDetails(true);
                          }}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t bg-gray-50">
              <Pagination
                currentPage={currentPage}
                pageSize={pageSize}
                total={total}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanApplicationsPage;