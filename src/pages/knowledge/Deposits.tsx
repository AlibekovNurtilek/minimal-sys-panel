import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Deposits() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('nav.deposits')}</h1>
        <p className="text-muted-foreground">
          Информация о депозитах и финансовых продуктах
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Депозиты</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Здесь будет размещена информация о депозитных программах и условиях.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}