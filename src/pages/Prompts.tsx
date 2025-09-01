import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Prompts() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('pages.prompts')}</h1>
        <p className="text-muted-foreground">
          Управление системными промтами и шаблонами
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Системные промты</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Здесь можно управлять системными промтами, шаблонами сообщений и автоматическими ответами.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}