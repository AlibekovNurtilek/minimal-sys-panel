import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Users() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('pages.users')}</h1>
        <p className="text-muted-foreground">
          Управление пользователями системы
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Список пользователей</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Здесь будет отображаться список пользователей с возможностью добавления, редактирования и удаления.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}