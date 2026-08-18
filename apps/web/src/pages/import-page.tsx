import { useTranslation } from "react-i18next";
import { PlaceholderPage } from "@/components/ui/placeholder-page";

export function ImportPage() {
  const { t } = useTranslation();
  return <PlaceholderPage title={t("importPage.title")} description={t("importPage.description")} />;
}
