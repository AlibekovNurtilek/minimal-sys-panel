import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, CustomersResponse, Customer } from "@/lib/api";
import { Pagination } from "@/components/Pagination";
import { User, Mail, Phone, ChevronRight } from "lucide-react";

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

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">{t('pages.users')}</h1>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
            </div>
            <p className="text-center mt-4 text-muted-foreground">Загрузка пользователей...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t('pages.users')}
        </h1>
        <p className="text-muted-foreground text-lg">Управление пользователями системы</p>
      </div>

      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg border-b">
          <CardTitle className="flex items-center space-x-2 text-xl">
            <User className="h-6 w-6 text-blue-600" />
            <span>Список пользователей</span>
            <span className="ml-auto text-sm font-normal text-muted-foreground bg-white px-3 py-1 rounded-full border">
              Всего: {total}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {error && (
            <div className="p-6 border-l-4 border-red-500 bg-red-50 m-6 rounded-r-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}
          
          {!error && customers.length === 0 && (
            <div className="p-12 text-center">
              <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">Пользователи не найдены</p>
              <p className="text-sm text-muted-foreground mt-2">Попробуйте изменить критерии поиска</p>
            </div>
          )}
          
          {!error && customers.length > 0 && (
            <>
              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <div className="flex items-center space-x-1">
                            <span>ID</span>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>Имя</span>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Фамилия
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-4 w-4" />
                            <span>Email</span>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>Телефон</span>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {customers.map((customer, index) => (
                        <tr
                          key={customer.id}
                          onClick={() => handleRowClick(customer.id)}
                          className="group cursor-pointer hover:bg-gradient-to-r"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-700">
                                {customer.id}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                              {customer.first_name}
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                              {customer.last_name}
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                              <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                                {customer.email}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                              <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                                {customer.phone_number}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-right">
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="p-6 bg-gray-50/50 border-t">
                <Pagination
                  currentPage={currentPage}
                  pageSize={pageSize}
                  total={total}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}