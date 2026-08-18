import { useTranslation } from "react-i18next";
import { useMe } from "@/features/auth/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfilePage() {
  const { t } = useTranslation();
  const { data } = useMe();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">{t("profilePage.title")}</h1>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>{t("profilePage.accountDetails")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">{t("profilePage.name")} </span>
            {data?.user.name}
          </div>
          <div>
            <span className="text-muted-foreground">{t("profilePage.email")} </span>
            <span dir="ltr">{data?.user.email}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
