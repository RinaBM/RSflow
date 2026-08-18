import { Clock } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="max-w-xl text-sm text-muted-foreground">{description}</p>
      </div>
      <EmptyState icon={Clock} title="Coming in a later phase" />
    </div>
  );
}
