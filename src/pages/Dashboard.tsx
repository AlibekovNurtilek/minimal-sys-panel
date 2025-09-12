import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { NavLink } from "react-router-dom";
import { FileText, CreditCard, Users, Banknote, WalletCards, PiggyBank } from "lucide-react";

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const features = [
    { 
      icon: <FileText className="h-10 w-10 text-primary" />, 
      key: "loanRequests",
      url: "/applications/loans" 
    },
    { 
      icon: <CreditCard className="h-10 w-10 text-primary" />, 
      key: "cardRequests",
      url: "/applications/cards" 
    },
    { 
      icon: <Users className="h-10 w-10 text-primary" />, 
      key: "users",
      url: "/users" 
    },
    { 
      icon: <Banknote className="h-10 w-10 text-primary" />, 
      key: "loanInfo",
      url: "/knowledge/loans" 
    },
    { 
      icon: <WalletCards className="h-10 w-10 text-primary" />, 
      key: "cardInfo",
      url: "/knowledge/cards" 
    },
    { 
      icon: <PiggyBank className="h-10 w-10 text-primary" />, 
      key: "depositInfo",
      url: "/knowledge/deposits" 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light text-slate-700 mb-4">
            {t("dashboard.heroTitle")}
          </h2>
          <p className="text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed">
            {t("dashboard.heroDescription")}
          </p>
        </div>

        {/* Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map(({ icon, key, url }) => (
            <FeatureCard
              key={key}
              icon={icon}
              title={t(`dashboard.features.${key}.title`)}
              description={t(`dashboard.features.${key}.description`)}
              url={url}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description, url }) {
  return (
    <NavLink
      to={url}
      className="block text-center p-6 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-slate-200"
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </NavLink>
  );
}
