import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const isHebrew = i18n.language === "he";

  return (
    <button
      type="button"
      onClick={() => i18n.changeLanguage(isHebrew ? "en" : "he")}
      className="inline-flex items-center gap-1.5 rounded-md border border-input px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-95"
    >
      <Languages className="h-3.5 w-3.5" />
      {isHebrew ? "English" : "עברית"}
    </button>
  );
}
