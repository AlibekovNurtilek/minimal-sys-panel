import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiClient, Customer } from "@/lib/api";
import Accounts from "@/components/customer/Accounts";
import Cards from "@/components/customer/Cards";
import Loans from "@/components/customer/Loans";
import Transactions from "@/components/customer/Transactions";

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"accounts" | "cards" | "loans" | "transactions">("accounts");

  const tabs = [
    { id: "accounts" as const, label: "Accounts" },
    { id: "cards" as const, label: "Cards" },
    { id: "loans" as const, label: "Loans" },
    { id: "transactions" as const, label: "Transactions" }
  ];

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        if (id) {
          const data = await apiClient.getCustomer(Number(id));
          setCustomer(data);
        }
      } catch (err) {
        setError("Failed to fetch customer details");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Customer Details</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {customer && (
        <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-500">Full Name</span>
              <p className="text-gray-900 font-medium">
                {customer.first_name} {customer.middle_name ? customer.middle_name + " " : ""}{customer.last_name}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-500">Email</span>
              <p className="text-gray-900">{customer.email}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-500">Phone</span>
              <p className="text-gray-900">{customer.phone_number}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-500">Address</span>
              <p className="text-gray-900">{customer.address}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-500">Birth Date</span>
              <p className="text-gray-900">{customer.birth_date}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-500">Passport</span>
              <p className="text-gray-900">{customer.passport_number}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-500">Created</span>
              <p className="text-gray-900">{new Date(customer.created_at).toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-500">Updated</span>
              <p className="text-gray-900">{new Date(customer.updated_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Красивые табы */}
      <div className="relative mb-8">
        <div className="flex bg-gray-100 rounded-xl p-1 shadow-inner">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`
                relative flex-1 px-6 py-3 rounded-lg font-medium text-sm 
                transition-all duration-300 ease-out
                ${activeTab === tab.id 
                  ? "bg-white text-blue-600 shadow-lg shadow-blue-100/50 transform scale-[1.02]" 
                  : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                }
              `}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              
              {/* Активный индикатор */}
              {activeTab === tab.id && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
        
        {/* Декоративная линия снизу */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Контент табов */}
      <div>
        {activeTab === "accounts" && <Accounts />}
        {activeTab === "cards" && <Cards />}
        {activeTab === "loans" && <Loans />}
        {activeTab === "transactions" && <Transactions />}
      </div>
    </div>
  );
}