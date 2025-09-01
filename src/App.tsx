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
import './i18n';

// Pages
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import About from "./pages/knowledge/About";
import Maps from "./pages/knowledge/Maps";
import Deposits from "./pages/knowledge/Deposits";
import FAQ from "./pages/knowledge/FAQ";
import Schemes from "./pages/Schemes";
import Prompts from "./pages/Prompts";
import Staff from "./pages/Staff";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <header className="h-12 border-b border-border bg-background flex items-center px-4">
            <SidebarTrigger />
          </header>
          <div className="p-6">
            {children}
          </div>
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
                <Route path="/" element={
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                } />
                <Route path="/users" element={
                  <AppLayout>
                    <Users />
                  </AppLayout>
                } />
                <Route path="/knowledge/about" element={
                  <AppLayout>
                    <About />
                  </AppLayout>
                } />
                <Route path="/knowledge/maps" element={
                  <AppLayout>
                    <Maps />
                  </AppLayout>
                } />
                <Route path="/knowledge/deposits" element={
                  <AppLayout>
                    <Deposits />
                  </AppLayout>
                } />
                <Route path="/knowledge/faq" element={
                  <AppLayout>
                    <FAQ />
                  </AppLayout>
                } />
                <Route path="/schemes" element={
                  <AppLayout>
                    <Schemes />
                  </AppLayout>
                } />
                <Route path="/prompts" element={
                  <AppLayout>
                    <Prompts />
                  </AppLayout>
                } />
                <Route path="/staff" element={
                  <AppLayout>
                    <Staff />
                  </AppLayout>
                } />
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
