import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('pages.dashboard')}</h1>
        <p className="text-muted-foreground">
          Добро пожаловать, {user?.username}!
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Пользователи</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">-</p>
            <p className="text-muted-foreground text-sm">Всего пользователей</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>База знаний</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">4</p>
            <p className="text-muted-foreground text-sm">Разделов</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Система</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-success">Онлайн</p>
            <p className="text-muted-foreground text-sm">Статус</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}