import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import "./i18n";

// Pages
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import About from "./pages/knowledge/About";
import Deposits from "./pages/knowledge/Deposits";
import FAQ from "./pages/knowledge/FAQ";
import Schemes from "./pages/Schemes";
import Prompts from "./pages/Prompts";
import Staff from "./pages/Staff";
import NotFound from "./pages/NotFound";
import CardsList from "./pages/knowledge/CardsList";
import Card from "./pages/knowledge/Card";
import UserDetail from "./pages/UserDetail";
import LoanApplicationsPage from "./pages/Loans"
import LoansInfo from "./pages/knowledge/LoansInfo";
import LoanSubCategories from "./pages/knowledge/LoansDetailInfo";
import LoanDetailPage from "./pages/knowledge/LoansDetailInfo";

const queryClient = new QueryClient();

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          {/* Хедер виден только на мобилках (<768px) */}
          <header className="h-12 border-b border-border bg-background flex items-center px-4 md:hidden">
            <SidebarTrigger />
          </header>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ProtectedRoute>
              <Routes>
                <Route
                  path="/"
                  element={
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <AppLayout>
                      <Users />
                    </AppLayout>
                  }
                />
                <Route
                  path="/loans"
                  element={
                    <AppLayout>
                      <LoanApplicationsPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/users/:id"
                  element={
                    <AppLayout>
                      <UserDetail />
                    </AppLayout>
                  }
                />
                <Route
                  path="/knowledge/about"
                  element={
                    <AppLayout>
                      <About />
                    </AppLayout>
                  }
                />
                <Route
                  path="/knowledge/cards"
                  element={
                    <AppLayout>
                      <CardsList />
                    </AppLayout>
                  }
                />
                <Route
                  path="/cards/:card_name"
                  element={
                    <AppLayout>
                      <Card />
                    </AppLayout>
                  }
                />
                <Route
                  path="/knowledge/deposits"
                  element={
                    <AppLayout>
                      <Deposits />
                    </AppLayout>
                  }
                />
                 <Route
                  path="/knowledge/loans_info"
                  element={
                    <AppLayout>
                      <LoansInfo />
                    </AppLayout>
                  }
                />
                 <Route
                    path="/knowledge/loans_info/:loan_type"
                    element={
                      <AppLayout>
                        <LoanDetailPage />
                      </AppLayout>
                  }
                />
                <Route
                  path="/knowledge/faq"
                  element={
                    <AppLayout>
                      <FAQ />
                    </AppLayout>
                  }
                />
                <Route
                  path="/schemes"
                  element={
                    <AppLayout>
                      <Schemes />
                    </AppLayout>
                  }
                />
                <Route
                  path="/prompts"
                  element={
                    <AppLayout>
                      <Prompts />
                    </AppLayout>
                  }
                />
                <Route
                  path="/staff"
                  element={
                    <AppLayout>
                      <Staff />
                    </AppLayout>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ProtectedRoute>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
