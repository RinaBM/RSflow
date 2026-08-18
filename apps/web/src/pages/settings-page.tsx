import { useTranslation } from "react-i18next";
import { PlaceholderPage } from "@/components/ui/placeholder-page";

export function SettingsPage() {
  const { t } = useTranslation();
  return <PlaceholderPage title={t("settingsPage.title")} description={t("settingsPage.description")} />;
}
