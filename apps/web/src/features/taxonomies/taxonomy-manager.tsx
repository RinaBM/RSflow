import { useEffect, useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ApiError } from "@/lib/api-client";
import type { createTaxonomyHooks } from "./hooks";
import type { TaxonomyItem } from "./api";

interface TaxonomyManagerProps<T extends TaxonomyItem> {
  title: string;
  singularLabel: string;
  hooks: ReturnType<typeof createTaxonomyHooks<T>>;
  withDescription?: boolean;
  withColor?: boolean;
}

export function TaxonomyManager<T extends TaxonomyItem>({
  title,
  singularLabel,
  hooks,
  withDescription,
  withColor,
}: TaxonomyManagerProps<T>) {
  const { data, isLoading, isError, error } = hooks.useList();
  const createMutation = hooks.useCreate();
  const updateMutation = hooks.useUpdate();
  const removeMutation = hooks.useRemove();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<T | undefined>(undefined);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#2a78d6");

  useEffect(() => {
    if (!dialogOpen) return;
    setName(editing?.name ?? "");
    setDescription(editing?.description ?? "");
    setColor(editing?.color ?? "#2a78d6");
  }, [dialogOpen, editing]);

  function openCreate() {
    setEditing(undefined);
    setDialogOpen(true);
  }

  function openEdit(item: T) {
    setEditing(item);
    setDialogOpen(true);
  }

  function handleDelete(item: T) {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    removeMutation.mutate(item.id, {
      onError: (err) => window.alert(err instanceof ApiError ? err.message : `Failed to delete ${singularLabel}`),
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const input: Record<string, unknown> = { name };
    if (withDescription) input.description = description || undefined;
    if (withColor) input.color = color || undefined;

    const onSuccess = () => setDialogOpen(false);
    if (editing) {
      updateMutation.mutate({ id: editing.id, ...input }, { onSuccess });
    } else {
      createMutation.mutate(input, { onSuccess });
    }
  }

  const mutation = editing ? updateMutation : createMutation;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Manage your {title.toLowerCase()}.</p>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New {singularLabel}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">Loading…</div>
      ) : isError ? (
        <div className="flex h-32 items-center justify-center text-sm text-destructive">
          {error instanceof ApiError ? error.message : `Failed to load ${title.toLowerCase()}`}
        </div>
      ) : data?.items.length === 0 ? (
        <div className="flex h-32 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border text-sm text-muted-foreground">
          No {title.toLowerCase()} yet.
          <Button variant="outline" size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Create your first {singularLabel}
          </Button>
        </div>
      ) : (
        <div className="divide-y divide-border rounded-xl border border-border">
          {data?.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="flex min-w-0 items-center gap-2">
                {withColor ? (
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color ?? "var(--muted-foreground)" }}
                  />
                ) : null}
                <div className="min-w-0">
                  <div className="truncate font-medium">{item.name}</div>
                  {withDescription && item.description ? (
                    <div className="truncate text-sm text-muted-foreground">{item.description}</div>
                  ) : null}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(item)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${singularLabel}` : `New ${singularLabel}`}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="taxonomy-name">Name</Label>
              <Input id="taxonomy-name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            {withDescription ? (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="taxonomy-description">Description</Label>
                <Textarea
                  id="taxonomy-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            ) : null}
            {withColor ? (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="taxonomy-color">Color</Label>
                <input
                  id="taxonomy-color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-9 w-16 rounded-md border border-input bg-background"
                />
              </div>
            ) : null}

            {mutation.isError ? (
              <p className="text-sm text-destructive">
                {mutation.error instanceof ApiError ? mutation.error.message : "Failed to save"}
              </p>
            ) : null}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
