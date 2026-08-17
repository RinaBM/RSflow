interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="max-w-xl text-sm text-muted-foreground">{description}</p>
      <div className="mt-6 flex h-64 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
        Coming in a later phase
      </div>
    </div>
  );
}
