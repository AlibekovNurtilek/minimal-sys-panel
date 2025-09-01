import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, CustomersResponse, Customer } from "@/lib/api";
import { Pagination } from "@/components/Pagination";

export default function Users() {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response: CustomersResponse = await apiClient.getCustomers(currentPage, pageSize);
        setCustomers(response.items);
        setTotal(response.total);
      } catch (err) {
        setError("Ошибка при загрузке пользователей");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowClick = (id: number) => {
    navigate(`/users/${id}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">{t('pages.users')}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список пользователей</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p>Загрузка...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && customers.length === 0 && (
            <p className="text-muted-foreground">Пользователи не найдены</p>
          )}
          {!loading && !error && customers.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Имя
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Фамилия
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Телефон
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      onClick={() => handleRowClick(customer.id)}
                      className="cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">{customer.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{customer.first_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{customer.last_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{customer.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{customer.phone_number}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loading && !error && customers.length > 0 && (
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              total={total}
              onPageChange={handlePageChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}