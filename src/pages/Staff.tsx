import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Staff() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('pages.staff')}</h1>
        <p className="text-muted-foreground">
          Управление сотрудниками и их правами доступа
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Управление сотрудниками</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Доступно только администраторам. Здесь можно управлять учетными записями сотрудников и их правами.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}