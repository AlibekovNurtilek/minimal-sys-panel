import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Schemes() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('pages.schemes')}</h1>
        <p className="text-muted-foreground">
          Управление схемами и конфигурациями системы
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Схемы</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Здесь будут отображаться схемы работы системы и возможности их настройки.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}