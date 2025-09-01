import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('nav.about')}</h1>
        <p className="text-muted-foreground">
          Информация о компании и системе
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>О нас</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Здесь будет размещена информация о компании, ее миссии, ценностях и команде.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}