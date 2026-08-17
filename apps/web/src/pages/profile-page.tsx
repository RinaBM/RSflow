import { useMe } from "@/features/auth/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfilePage() {
  const { data } = useMe();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Account details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Name: </span>
            {data?.user.name}
          </div>
          <div>
            <span className="text-muted-foreground">Email: </span>
            {data?.user.email}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
