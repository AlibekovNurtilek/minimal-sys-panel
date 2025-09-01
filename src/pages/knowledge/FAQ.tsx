import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FAQ() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('nav.faq')}</h1>
        <p className="text-muted-foreground">
          Часто задаваемые вопросы и ответы
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>FAQ</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Здесь будут размещены часто задаваемые вопросы и развернутые ответы на них.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}