import { 
  Users, 
  BookOpen, 
  Info, 
  HelpCircle,
  UserCog,
  LogOut,
  ChevronRight,
  FileText,
  CreditCard as CardIcon,
  Banknote, WalletCards, PiggyBank
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";

export function AppSidebar() {
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-primary font-medium" : "hover:bg-sidebar-accent/50";

  const knowledgeItems = [
    { title: t('nav.about'), url: "/knowledge/about", icon: Info },
    { title: t('nav.loan_know'), url: "/knowledge/loans", icon: Banknote },
    { title: t('nav.maps'), url: "/knowledge/cards", icon: WalletCards },
    { title: t('nav.deposits'), url: "/knowledge/deposits", icon: PiggyBank },
    { title: t('nav.faq'), url: "/knowledge/faq", icon: HelpCircle },
  ];

  const isKnowledgeActive = knowledgeItems.some(item => isActive(item.url));

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"}>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <div className="h-8 w-8 rounded bg-sidebar-primary flex items-center justify-center">
                <span className="text-sidebar-primary-foreground font-bold">Ai</span>
              </div>
              <span className="font-semibold text-sidebar-foreground">Admin Panel</span>
            </div>
          )}
          <LanguageToggle/>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{!collapsed && t('nav.users')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/users" className={getNavCls}>
                    <Users className="h-4 w-4" />
                    {!collapsed && <span>{t('nav.users')}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/applications/loans" className={getNavCls}>
                    <FileText className="h-4 w-4" />
                    {!collapsed && <span>{t('nav.loans')}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/applications/cards" className={getNavCls}>
                    <CardIcon className="h-4 w-4" />
                    {!collapsed && <span>{t('nav.cards')}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen={isKnowledgeActive}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <BookOpen className="h-4 w-4" />
                      {!collapsed && (
                        <>
                          <span>{t('nav.knowledge')}</span>
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {knowledgeItems.map((item) => (
                        <SidebarMenuSubItem key={item.url}>
                          <SidebarMenuSubButton asChild>
                            <NavLink to={item.url} className={getNavCls}>
                              <item.icon className="h-4 w-4" />
                              {!collapsed && <span>{item.title}</span>}
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/schemes" className={getNavCls}>
                    <Network className="h-4 w-4" />
                    {!collapsed && <span>{t('nav.schemes')}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/prompts" className={getNavCls}>
                    <MessageSquare className="h-4 w-4" />
                    {!collapsed && <span>{t('nav.prompts')}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}

        {user?.role === 'admin' && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/staff" className={getNavCls}>
                      <UserCog className="h-4 w-4" />
                      {!collapsed && <span>{t('nav.staff')}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {user && (
          <div className="relative flex flex-col gap-1 group">
            <div className="flex items-center gap-2 border-b border-sidebar-border pb-2">
              <div className="h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold">
                {user.username?.[0].toUpperCase()}
              </div>
              <span className="text-sidebar-foreground font-medium">{user.username}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="absolute top-0 right-0 h-8 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span className="ml-2">{t('auth.logout')}</span>}
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}