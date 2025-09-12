import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/Pagination";
import { employeesApiClient, Employee, CreateEmployeeData } from "@/api/employee";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/PageHeader";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function Staff() {
  const { t } = useTranslation();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [newEmployee, setNewEmployee] = useState<CreateEmployeeData>({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchEmployees = async (pageNumber: number) => {
    setLoading(true);
    try {
      const data = await employeesApiClient.getEmployees(pageNumber, pageSize);
      setEmployees(data.items);
      setTotal(data.total);
      setPage(data.page);
    } catch (error) {
      console.error("Failed to fetch employees", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("Are you sure you want to delete this employee?"))) return;
    try {
      await employeesApiClient.deleteEmployee(id);
      fetchEmployees(page);
    } catch (error) {
      console.error("Failed to delete employee", error);
    }
  };

  const handleCreate = async () => {
    if (!newEmployee.username || !newEmployee.password) {
      setErrorMessage(t("Please enter both username and password"));
      return;
    }

    try {
      await employeesApiClient.createEmployee(newEmployee);
      setNewEmployee({ username: "", password: "" });
      setErrorMessage(null);
      setIsDialogOpen(false); // закрываем диалог
      fetchEmployees(page); // обновляем список
    } catch (error: any) {
      console.error("Failed to create employee", error);
      // можно вывести message из ошибки, если есть
      setErrorMessage(error?.message || t("Failed to create employee"));
    }
  };

  useEffect(() => {
    fetchEmployees(page);
  }, [page]);

  return (
    <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">{t("pages.staff")}</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" /> {t("Add Employee")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("Add New Employee")}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {errorMessage && (
                <div className="text-red-600 text-sm">{errorMessage}</div>
              )}
              <div className="grid gap-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("Username")}
                </label>
                <Input
                  id="username"
                  placeholder={t("Enter username")}
                  value={newEmployee.username}
                  onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("Password")}
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("Enter password")}
                  value={newEmployee.password}
                  onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{t("Cancel")}</Button>
              </DialogClose>
              <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                {t("Create")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Employees Table */}
      <Card className="border-none shadow-lg rounded-xl overflow-hidden bg-white dark:bg-gray-800">
        <CardHeader className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4">
          <CardTitle className="text-lg font-medium text-gray-800 dark:text-white">
            {t("Employees List")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500 dark:text-gray-400">{t("Loading...")}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">{t("Username")}</th>
                    <th className="px-6 py-3">{t("Role")}</th>
                    <th className="px-6 py-3">{t("Created At")}</th>
                    <th className="px-6 py-3">{t("Updated At")}</th>
                    <th className="px-6 py-3">{t("Actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {employees.length > 0 ? (
                    employees.map((emp) => (
                      <tr
                        key={emp.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{emp.id}</td>
                        <td className="px-6 py-4">{emp.username}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-medium">
                            {emp.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          {new Date(emp.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          {new Date(emp.updated_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDelete(emp.id)}
                            className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 text-sm"
                            aria-label={t("Delete employee")}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>{t("Delete")}</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                        {t("No employees found")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center sm:justify-end p-4 border-t bg-gray-50 dark:bg-gray-700/30">
            <Pagination
              currentPage={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
